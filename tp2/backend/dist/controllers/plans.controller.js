var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import * as planService from '../services/plans.service.js';
import * as openAiService from '../services/openApi.service.js';
import * as profileService from '../services/profile.service.js';
function draftPlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        const plan = req.body.plan;
        if (!plan || !plan.title || (!plan.preferences && !plan.restrictions)) {
            res.status(400).json({ error: { message: 'Faltan datos para crear el plan' } });
            return;
        }
        // Si no es doctor, no puede tener planes ya creados
        const profile = yield profileService.getProfile(profileId);
        const profilePlan = yield planService.getPlan(profileId);
        if (profile.accountType !== 'doc' && profilePlan) {
            res.status(400).json({ error: { message: 'El perfil ya tiene un plan asignado' } });
            return;
        }
        // Creamos el plan
        let planId;
        console.log("Creando el plan");
        try {
            planId = yield planService.draftPlan(profileId, plan);
        }
        catch (err) {
            res.status(400).json({ err, message: err.message });
        }
        console.log("Plan creado", planId);
        try {
            console.log("Creando thread");
            // Creamos el thread
            const thread = yield openAiService.startThread(plan.title, plan.restrictions, plan.preferences);
            console.log("Thread creado", thread.thread_id);
            // Guardamos el thread id en la base de datos
            yield planService.updatePlanMeta(planId, { threadId: thread.thread_id });
            console.log("Plan", planId, "actualizado con thread", thread.thread_id);
            res.status(200).json({ planId });
        }
        catch (err) {
            res.status(400).json({ err, message: err.message });
        }
    });
}
;
function generatePlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        const profile = yield profileService.getProfile(profileId);
        if (!profile) {
            throw new Error('El perfil no existe');
        }
        try {
            const newPlan = yield planService.generatePlan(profileId);
            planService.savePlan(profileId, newPlan);
            res.status(200).json(newPlan);
        }
        catch (err) {
            res.status(400).json({ err, message: err.message });
        }
    });
}
/*async function generatePlanFromDraft(req: Request, res: Response) {
  const planId = req.params.id;
  const profileId = req.body.profileId;
  let draftId;

  if (!planId) {
    console.log("No hay plan ID, tomando el plan del perfil");
    const draft = await planService.getPlan(profileId);
    draftId = draft?._id;
  } else {
    draftId = new ObjectId(planId);
  }

  if (!draftId) {
    res.status(400).json({ error: { message: 'No se encontro el draft' } });
    return;
  }

  try {
    const newPlan = await planService.generatePlanFromDraft(draftId);
    await planService.updatePlanMeta(draftId, { status: 'saved' });
    res.status(200).json(newPlan);
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
}*/
function generatePlanFromDraft(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const planId = req.params.id;
        const profileId = req.body.profileId;
        let draftId;
        if (!planId) {
            console.log("No hay plan ID, tomando el plan del perfil");
            const draft = yield planService.getPlan(profileId);
            draftId = draft === null || draft === void 0 ? void 0 : draft._id;
        }
        else {
            draftId = new ObjectId(planId);
        }
        if (!draftId) {
            res.status(400).json({ error: { message: 'No se encontro el draft' } });
            return;
        }
        try {
            const plan = yield planService.getPlanById(planId);
            console.log(plan);
            const { threadId } = plan.meta;
            const message = "Generame las recetas para el dia Monday";
            yield openAiService.addMessages(threadId, message);
            yield openAiService.startRun(threadId, (data) => {
                console.log("Day Data: ", data);
            }, (data) => {
                console.log(data);
            });
            /*
            for (let day in plan.meals) {
              const message = "Generame las recetas para el dia " + day;
              await openAiService.addMessages(threadId, message);
              await openAiService.startRun(threadId, (data) => {
                console.log("Day Data: ", data);
              }, (data) => {
                console.log(day, " finished");
              });
            }
            */
            console.log("All days finished");
        }
        catch (err) {
            res.status(400).json({ err, message: err.message });
        }
    });
}
function generateDocPlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            res.status(201).json({ message: "Nuevo plan creado" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getPlans(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        planService.getPlans(profileId)
            .then((plans) => {
            res.status(200).json(plans);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getPlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        planService.getPlan(profileId)
            .then((plan) => {
            res.status(200).json(plan);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getPlanById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const planId = req.params.planId;
        planService.getPlanById(planId)
            .then((plan) => {
            res.status(200).json(plan);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        const ingredients = [];
        try {
            const list = yield planService.getList(profileId);
            if (list) {
                return res.status(200).json(list);
            }
            else {
                const plan = yield planService.getPlan(profileId);
                if (!plan) {
                    return res.status(400).json({ message: 'El plan no existe aun para este perfil.' });
                }
                Array.from(Object.keys(plan.meals)).forEach((day) => {
                    // @ts-ignore
                    Array.from(Object.keys(plan.meals[day])).forEach((meal) => {
                        // @ts-ignore
                        plan.meals[day][meal].ingredients.forEach((ingredient) => {
                            ingredients.push(ingredient);
                        });
                    });
                });
                yield planService.generateShoppingList(profileId, ingredients);
                yield planService.getPlan(profileId).then((plan) => {
                    res.status(201).json(plan.shoppingList);
                });
            }
        }
        catch (err) {
            res.status(400).json({ err, message: err.message });
        }
    });
}
function assignPlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const patientId = req.params.patientId;
        const planId = req.params.planId;
        planService.assignPlan(patientId, planId)
            .then(() => {
            res.status(201).json({ message: "Plan asignado" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function deletePlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const docId = req.body.profileId;
        const planId = req.params.planId;
        planService.deletePlan(docId, planId)
            .then(() => {
            res.status(202).json({ message: "Plan eliminado" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function replaceRecipie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        const day = req.params.day;
        const meal = req.params.meal;
        res.setHeader('Content-Type', 'application/json');
        if (!day || !meal) {
            res.status(400).json({ error: { message: 'Faltan datos' } });
            return;
        }
        const profile = yield profileService.getProfile(profileId);
        if (!profile) {
            res.status(400).json({ error: { message: 'El perfil no existe' } });
            return;
        }
        let newRecipie = "";
        console.log(day, meal);
        try {
            openAiService.generateRecipie(profile.restrictions, profile.preferences, "", day, meal, (data) => {
                newRecipie += data;
                res.write(data);
            }, (data) => __awaiter(this, void 0, void 0, function* () {
                yield planService.replaceRecipie(profileId, day, meal, JSON.parse(newRecipie));
                res.end(data);
            }));
        }
        catch (err) {
            res.status(400).json({ err, message: err.message });
        }
    });
}
function generateRecipies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        const listado = req.body.listado;
        planService.generateRecipies(profileId, listado)
            .then((recipies) => {
            res.status(200).json(recipies);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
/*
  Proceso:
    - Crear un thread
    - Guardar el ID del thread para DOC <-> Paciente
    - Crear un mensaje
    - Run el thread
    - Retornar los mensajes
*/
function assistantStartThread(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = req.body.title;
        const preferences = req.body.preferences;
        const restrictions = req.body.restrictions;
        const thread = yield openAiService.startThread(title, restrictions, preferences);
        // Guardar el thread id en la base de datos (thread.id)
        res.status(200).json(thread);
    });
}
function assistantGetThreadMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Esto deberia ir en un plan service para tener la data de la DB
        const id = req.params.id;
        const thread = yield openAiService.getThreadMessages(id);
        res.status(200).json(thread.data);
    });
}
function assistantGetThread(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const thread = yield openAiService.getThread(id);
        const messages = yield openAiService.getThreadMessages(id);
        res.status(200).json({
            thread,
            messages: messages.data
        });
    });
}
function assistantAddMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const threadId = req.body.thread;
        const message = req.body.message;
        yield openAiService.addMessages(threadId, message);
        yield openAiService.startRun(threadId, (data) => {
            res.write(data);
        }, (data) => {
            res.end(data);
        });
    });
}
function assistantGeneratePlan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const threadId = req.body.thread;
        const thread = yield openAiService.getThread(threadId);
        const lastMessage = yield openAiService.getLastMessage(threadId);
        const messageValue = lastMessage[0].text.value;
        const restrictions = thread.metadata.restrictions;
        const preferences = thread.metadata.preferences;
        //res.status(200).json(messageValue);
        const plan = yield planService.generateRecipies(restrictions, preferences, lastMessage);
        res.status(200).json(plan);
    });
}
export { draftPlan, generatePlanFromDraft, generatePlan, generateDocPlan, getPlans, getPlan, getPlanById, getList, assignPlan, deletePlan, replaceRecipie, generateRecipies, assistantStartThread, assistantAddMessage, assistantGeneratePlan, assistantGetThreadMessages, assistantGetThread };
