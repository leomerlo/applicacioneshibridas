import { Request, Response } from 'express';
import * as planService from '../services/plans.service.js';
import * as openAiService from '../services/openApi.service.js';
import * as profileService from '../services/profile.service.js';
import { Ingredients } from '../types/recipies.js';
import { Plan } from '../types/plan.js';
import type { Profile } from '../types/profile.js';

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

async function generateDocPlan(req: Request, res: Response) {
  const docId = req.body.profileId;
  const title = req.body.title;
  const preferences = req.body.preferences;
  const restrictions = req.body.restrictions;

  if (!preferences || !restrictions || !title) {
    res.status(400).json({ error: { message: "Faltan detalles para generar el plan." } });
    return;
  }

  planService.generateDocPlan(docId, preferences, restrictions, title)
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
  const preferences = req.body.preferences;
  const restrictions = req.body.restrictions;
  const thread = await openAiService.startThread(restrictions, preferences);
  // Guardar el thread id en la base de datos (thread.id)
  res.status(200).json(thread);
}

async function assistantAddMessage(req: Request, res: Response) {
  const threadId = req.body.thread;
  const message = req.body.message;

  await openAiService.addMessages(threadId, message);
  const response = await openAiService.startRun(threadId);
  res.status(200).json(response);
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
  assistantGeneratePlan
}