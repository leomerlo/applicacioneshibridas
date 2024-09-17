import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import * as planService from '../services/plans.service.js';
import * as openAiService from '../services/openApi.service.js';
import * as profileService from '../services/profile.service.js';
import { Ingredients } from '../types/recipies.js';
import { Meals, Plan } from '../types/plan.js';
import type { Profile } from '../types/profile.js';

async function draftPlan(req: Request, res: Response) {
  const profileId = req.body.profileId;
  const plan = req.body.plan;

  if (!plan || !plan.title || (!plan.preferences && !plan.restrictions)) {
    res.status(400).json({ error: { message: 'Faltan datos para crear el plan' } });
    return;
  }

  // Si no es doctor, no puede tener planes ya creados
  const profile = await profileService.getProfile(profileId) as Profile;
  const profilePlan = await planService.getPlan(profileId);
  if (profile.accountType !== 'doc' && profilePlan) {
    res.status(400).json({ error: { message: 'El perfil ya tiene un plan asignado' } });
    return;
  }

  // Creamos el plan
  let planId;

  console.log("Creando el plan");

  try {
    planId = await planService.draftPlan(profileId, plan);
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }

  console.log("Plan creado", planId);

  try {
    console.log("Creando thread");
    // Creamos el thread
    const thread = await openAiService.startThread(plan.title, plan.restrictions, plan.preferences);

    console.log("Thread creado", thread.thread_id);

    // Guardamos el thread id en la base de datos
    await planService.updatePlanMeta(planId as ObjectId, { threadId: thread.thread_id });

    console.log("Plan", planId, "actualizado con thread", thread.thread_id);

    res.status(200).json({ planId });
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
};

async function generatePlan(req: Request, res: Response) {
  const profileId = req.body.profileId;
  const profile = await profileService.getProfile(profileId) as Profile;

  if(!profile) {
    throw new Error('El perfil no existe');
  }

  try {
    const newPlan = await planService.generatePlan(profileId);
    planService.savePlan(profileId, newPlan);
    res.status(200).json(newPlan);
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
}

async function generatePlanFromDraft(req: Request, res: Response) {
  const planId = req.params.id;
  const profileId = req.body.profileId;
  let draftId;

  if (!planId) {
    console.log("No hay plan ID, tomando el plan del perfil");
    const draft = await planService.getPlan(profileId);
    draftId = draft?._id?.toString();
  } else {
    draftId = planId;
  }

  if (!draftId) {
    res.status(400).json({ error: { message: 'No se encontro el draft' } });
    return;
  }

  try {
    const plan = await planService.getPlanById(draftId as string);
    const { threadId } = plan.meta as { threadId: string };
    
    const meals = await generateRecipiesFull(threadId);

    console.log("Ready for saving", meals);

    await planService.savePlanMeals(draftId, meals);
    res.status(200).json({ message: "Plan finished" });
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
}

async function generateRecipiesFull(threadId: string) {
  let meals = {};
  const message = "Guardar el plan completo";
  await openAiService.addMessages(threadId, message);

  console.log("Full plan start");
      
  await openAiService.startRun(threadId, 'plan', (data) => {
  }, async (data) => {
    if (data.event === 'thread.message.completed') {
      console.log("Full plan finished");
      meals = data.data.content[0].text.value;
      return meals;
    }
    return meals;
  });

  return meals;
}

// async function generateRecipiesByDay(meals: any, threadId: string) {
//   let plan = [];
  
//   for (let day in meals) {
//     console.log("Day start ", day);
//     const message = "Generame las recetas para el dia " + day;
//     await openAiService.addMessages(threadId, message);
//     await openAiService.startRun(threadId, (data) => {
//       plan[day] = data;
//     }, async () => {
//       console.log("Day finished ", day);
//       // Al terminar, removemos los mensajes generados
//       await openAiService.removeLastMessages(threadId);
//     });
//   }

//   return plan;
// }

async function generateDocPlan(req: Request, res: Response) {
  const docId = req.body.profileId;
  const title = req.body.title;
  const thread = req.body.thread;
  const preferences = req.body.preferences;
  const restrictions = req.body.restrictions;
  const listado = req.body.listado;

  if (!preferences || !restrictions || !title) {
    res.status(400).json({ error: { message: "Faltan detalles para generar el plan." } });
    return;
  }

  planService.generateDocPlan(docId, preferences, restrictions, title, listado, thread)
    .then(() => {
      res.status(201).json({ message: "Nuevo plan creado" })
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

async function getPlans(req: Request, res: Response) {
  const profileId = req.body.profileId;

  planService.getPlans(profileId)
    .then((plans) => {
      res.status(200).json(plans)
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

async function getPlan(req: Request, res: Response) {
  const profileId = req.body.profileId;

  planService.getPlan(profileId)
    .then((plan) => {
      res.status(200).json(plan)
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

async function getPlanById(req: Request, res: Response) {
  const planId = req.params.planId;

  planService.getPlanById(planId)
    .then((plan) => {
      res.status(200).json(plan)
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

async function getList(req: Request, res: Response) {
  const profileId = req.body.profileId;
  const ingredients: Ingredients[] = [];

  try {
    const list = await planService.getList(profileId);

    if (list) {
      return res.status(200).json(list);
    } else {

      const plan: Plan = await planService.getPlan(profileId);

      if (!plan) {
        return res.status(400).json({ message: 'El plan no existe aun para este perfil.' });
      }

      Array.from(Object.keys(plan.meals)).forEach((day) => {
        // @ts-ignore
        Array.from(Object.keys(plan.meals[day])).forEach((meal: string) => {
          // @ts-ignore
          plan.meals[day][meal].ingredients.forEach((ingredient: Ingredients) => {
            ingredients.push(ingredient);
          });
        });
      });

      await planService.generateShoppingList(profileId, ingredients);

      await planService.getPlan(profileId).then((plan) => {
        res.status(201).json(plan.shoppingList);
      });
    }
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
}

async function assignPlan(req: Request, res: Response) {
  const patientId = req.params.patientId;
  const planId = req.params.planId;

  planService.assignPlan(patientId, planId)
    .then(() => {
      res.status(201).json({ message: "Plan asignado" })
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

async function deletePlan(req: Request, res: Response) {
  const docId = req.body.profileId;
  const planId = req.params.planId;

  planService.deletePlan(docId, planId)
    .then(() => {
      res.status(202).json({ message: "Plan eliminado" })
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

async function replaceRecipie(req: Request, res: Response) {
  const profileId = req.body.profileId;
  const day = req.params.day;
  const meal = req.params.meal;

  res.setHeader('Content-Type', 'application/json');

  if (!day || !meal) {
    res.status(400).json({ error: { message: 'Faltan datos' } })
    return;
  }

  const profile = await profileService.getProfile(profileId);

  if (!profile) {
    res.status(400).json({ error: { message: 'El perfil no existe' } })
    return;
  }

  let newRecipie = "";

  console.log(day, meal);

  try {
    openAiService.generateRecipie(profile.restrictions as string, profile.preferences as string, "", day, meal, (data) => {
      newRecipie += data;
      res.write(data);
    }, async (data) => {
      await planService.replaceRecipie(profileId, day, meal, JSON.parse(newRecipie))
      res.end(data);
    });
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
}

async function generateRecipies(req: Request, res: Response) {
  const profileId = req.body.profileId;
  const listado = req.body.listado;

  planService.generateRecipies(profileId, listado)
    .then((recipies) => {
      res.status(200).json(recipies)
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

/*
  Proceso:
    - Crear un thread
    - Guardar el ID del thread para DOC <-> Paciente
    - Crear un mensaje
    - Run el thread
    - Retornar los mensajes
*/

async function assistantStartThread(req: Request, res: Response) {
  const title = req.body.title;
  const preferences = req.body.preferences;
  const restrictions = req.body.restrictions;
  const thread = await openAiService.startThread(title, restrictions, preferences);
  // Guardar el thread id en la base de datos (thread.id)
  res.status(200).json(thread);
}

async function assistantGetThreadMessages(req: Request, res: Response) {
  // TODO: Esto deberia ir en un plan service para tener la data de la DB
  const id = req.params.id;
  const thread = await openAiService.getThreadMessages(id);
  res.status(200).json(thread.data);
}

async function assistantGetThread(req: Request, res: Response) {
  const id = req.params.id;
  const thread = await openAiService.getThread(id);
  const messages = await openAiService.getThreadMessages(id);
  res.status(200).json({
    thread,
    messages: messages.data
  });
}

async function assistantAddMessage(req: Request, res: Response) {
  const threadId = req.body.thread;
  const message = req.body.message;

  await openAiService.addMessages(threadId, message);
  await openAiService.startRun(threadId, 'message', (data) => {
    res.write(data);
  }, (data) => {
    res.end(data);
  });
}

async function assistantGeneratePlan(req: Request, res: Response) {
  const threadId = req.body.thread;

  const thread = await openAiService.getThread(threadId);
  const lastMessage = await openAiService.getLastMessage(threadId);
  const messageValue = lastMessage[0].text.value;

  const restrictions = thread.metadata.restrictions;
  const preferences = thread.metadata.preferences;

  //res.status(200).json(messageValue);
  const plan = await planService.generateRecipies(restrictions, preferences, lastMessage);
  res.status(200).json(plan);
}

export {
  draftPlan,
  generatePlanFromDraft,
  generatePlan,
  generateDocPlan,
  getPlans,
  getPlan,
  getPlanById,
  getList,
  assignPlan,
  deletePlan,
  replaceRecipie,
  generateRecipies,
  assistantStartThread,
  assistantAddMessage,
  assistantGeneratePlan,
  assistantGetThreadMessages,
  assistantGetThread
}