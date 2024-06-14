import { ObjectId } from 'mongodb';
import * as planSchema from '../schemas/plan.schema.js';
import * as recipieSchema from '../schemas/recipies.schema.js';
import { Meals, Plan, PlanMeta } from '../types/plan.js';
import * as openApi from './openApi.service.js';
import { Ingredients, Recipie } from '../types/recipies.js';
import * as profileService from './profile.service.js';
import * as recipiesService from './recipies.service.js';
import { Profile } from '../types/profile.js';
import { db, client } from './mongo.service.js';

function blankPlan(): Plan {
  return {
    meta: {
      status: 'draft',
      title: '',
      restrictions: '',
      preferences: ''
    },
    meals: {
      monday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        }
      },
      tuesday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        }
      },
      wednesday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        }
      },
      thursday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        }
      },
      friday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        }
      },
      saturday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        }
      },
      sunday: {
        breakfast: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        lunch: {
          name: '',
          ingredients: [],
          instructions: [],
        },
        dinner: {
          name: '',
          ingredients: [],
          instructions: [],
        },
      },
    },
  }
}

async function draftPlan(profileId: ObjectId, plan: PlanMeta): Promise<ObjectId> {
  await client.connect()

  const profile = await profileService.getProfile(profileId) as Profile;
  if(!profile) {
    throw new Error('El perfil no existe');
  }

  const blank = blankPlan();

  const newPlan = {
    ...blank,
    meta: {
      ...blank.meta,
      ...plan
    },
    docId: new ObjectId(profileId)
  }

  // Saves the plan to the database and returns the id
  const response = await db.collection("plans").insertOne(newPlan);
  return response.insertedId;
}

async function updatePlanMeta(planId: ObjectId, planMeta: Partial<PlanMeta>): Promise<void> {
  await client.connect()

  const planExists = await db.collection("plans").findOne({ _id: new ObjectId(planId) });

  if (planExists) {
    await db.collection("plans").findOneAndUpdate({ _id: new ObjectId(planId) }, { $set: { meta: {
      ...planExists.meta,
      ...planMeta
    } } });
  } else {
    throw new Error('El plan no existe');
  }
}

async function generatePlan(profileId: ObjectId): Promise<Meals> {
  await client.connect()

  const profile = await profileService.getProfile(profileId) as Profile;
  if(!profile) {
    throw new Error('El perfil no existe');
  }

  let likedRecipies: string = '';
  await recipiesService.getLikedRecipies(profileId).then((recipies) => {
    likedRecipies = recipies.map((recipie) => recipie.name).join(', ');
  });

  const rawOutput = await openApi.generatePlan(profile.restrictions || '', profile.preferences || '', likedRecipies);

  const meals = JSON.parse(rawOutput as string);

  return meals;
}

async function generatePlanFromDraft(draftId: ObjectId): Promise<Meals> {
  await client.connect()

  const plan = await db.collection("plans").findOne({ _id: new ObjectId(draftId) });

  if (!plan) {
    throw new Error('No se encontro el plan');
  }

  const rawOutput = await openApi.generatePlan(plan.meta.restrictions, plan.meta.preferences, '');

  const meals = JSON.parse(rawOutput as string);

  planSchema.meals.validate(meals, { abortEarly: false, stripUnknown: true })
  .then(async (meals) => {
    await db.collection("plans").findOneAndReplace({ _id: new ObjectId(draftId) }, { ...plan, meals });
  })
  .catch((err) => {
    console.log('Validation error', err);
  })

  return meals;
}

async function savePlan(profileId: ObjectId, meals: Meals): Promise<void> {
  await client.connect()

  planSchema.meals.validate(meals, { abortEarly: false, stripUnknown: true })
  .then(async (meals) => {
    const planExists = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) });
  
    if (planExists) {
      await db.collection("plans").findOneAndUpdate({ profileId: new ObjectId(profileId) }, { $set: { meals, profileId: new ObjectId(profileId) } });
    } else {
      const plan = {
        ...blankPlan(),
        meals,
        profileId: new ObjectId(profileId)
      }
      await db.collection("plans").insertOne(plan);
    }
  })
  .catch((err) => {
    console.log('Validation error', err);
  })
}

async function generateDocPlan(docId: ObjectId, preferences: string, restrictions: string, title: string, listado: string, thread: string): Promise<void> {
  await client.connect()

  const rawOutput = await openApi.generateRecipies(restrictions, preferences, listado);
  const meals = JSON.parse(rawOutput as string);

  planSchema.meals.validate(meals, { abortEarly: false, stripUnknown: true })
    .then(async (meals) => {
      const plan = {
        meals,
        title: title,
        docId: new ObjectId(docId),
        threadId: thread
      }
    
      await db.collection("plans").insertOne(plan);
    })
    .catch((err) => {
      console.log('Validation error', err);
    })
}

async function getPlans(docId: string): Promise<Plan[]> {
  await client.connect()
  const plans = await db.collection("plans").find({ docId: new ObjectId(docId) }, { projection: { profileId: 0 } }).toArray();
  return plans as Plan[];
}

async function getPlan(profileId: string): Promise<Plan> {
  await client.connect()
  const plan = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { profileId: 0 } });
  return plan as Plan;
}

async function getPlanById(id: string): Promise<Plan> {
  await client.connect()
  const plan = await db.collection("plans").findOne({ _id: new ObjectId(id) }, { projection: { _id: 0, profileId: 0 } });
  return plan as Plan;
}

async function getList(profileId: string): Promise<Ingredients[]> {
  await client.connect()
  const list = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { _id: 0, profileId: 0, meals: 0 } });
  return list?.shoppingList as Ingredients[];
}

async function generateShoppingList(profileId: ObjectId, ingredients: Ingredients[]): Promise<void> {
  await client.connect()
  const unifiedList: Ingredients[] = [];

  ingredients.forEach((ingredient) => {
    let found = unifiedList.find((item) => {
      return item.name === ingredient.name;
    });
    if (found) {
      // @ts-ignore-next-line
      found += ingredient.quantity;
    } else {
      // @ts-ignore-next-line
      unifiedList.push({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit
      });
    }
  });

  const organizedList = await openApi.generateShoppingList(unifiedList);
  await db.collection("plans").updateOne({ profileId: new ObjectId(profileId) }, { $set: { shoppingList: JSON.parse(organizedList) } });
}

async function assignPlan(patientId: string, planId: string): Promise<void> {
  await client.connect()

  const plan = await db.collection("plans").findOne({ _id: new ObjectId(planId) }, { projection: { _id: 0, docId: 0 } });

  if (!plan) {
    throw new Error('El plan no existe');
  }

  const assignedPlan = {
    ...plan,
    planId: new ObjectId(planId),
    profileId: new ObjectId(patientId)
  }

  const profilePlan = await db.collection("plans").findOne({ profileId: new ObjectId(patientId) }, { projection: { _id: 0, docId: 0 } });

  if(profilePlan) {
    await db.collection("plans").findOneAndReplace({ profileId: new ObjectId(patientId) }, assignedPlan);
  } else {
    await db.collection("plans").insertOne(assignedPlan);
  }
}

async function deletePlan(docId: string, planId: string): Promise<void> {
  await client.connect()

  const assigned = await db.collection("plans").find({ planId: new ObjectId(planId) }).toArray();

  if (assigned.length > 0) {
    throw new Error('El plan esta asignado a al menos un paciente.');
  } else {
    await db.collection("plans").deleteOne({ docId: new ObjectId(docId), _id: new ObjectId(planId) });
  }
}

async function editPlan(docId: string, planId: string, plan: Plan): Promise<void> {
  await client.connect();

  const exists = db.collection("plans").findOne({ docId: new ObjectId(docId), _id: new ObjectId(planId) });

  if (!exists) {
    throw new Error('El plan no existe');
  }

  await db.collection("plans").findOneAndReplace({ docId: new ObjectId(docId), _id: new ObjectId(planId) }, plan);
}

async function replaceRecipie(profileId: ObjectId, day: string, meal: string, recipie: Recipie): Promise<Recipie> {
  await client.connect()
  const plan = await db.collection("plans").findOne<Plan>({$or: [{ profileId: new ObjectId(profileId) },{ _id: new ObjectId(profileId) }]});
  const profile = await db.collection("profiles").findOne<Profile>({_id: new ObjectId(profileId)});
  
  if (!plan || !profile) {
    return Promise.reject();
  }

  // Un listado de los nombres de todas las recetas del Plan
  const recipies: string[] = [];
  Array.from(Object.keys(plan.meals)).forEach((day) => {
    // @ts-ignore
    Array.from(Object.keys(plan?.meals[day])).forEach((meal: string) => {
      // @ts-ignore
      recipies.push(plan?.meals[day][meal].name);
    });
  });

  await recipieSchema.recipie.validate(recipie, { abortEarly: false, stripUnknown: true }) as Recipie;

  if (plan != undefined) {
    plan.meals[day][meal] = recipie;
  } else {
    Promise.reject();
  }

  /* const ingredients: Ingredients[] = [];

  Array.from(Object.keys(plan.meals)).forEach((day) => {
    // @ts-ignore
    Array.from(Object.keys(plan.meals[day])).forEach((meal: string) => {
      // @ts-ignore
      plan.meals[day][meal].ingredients.forEach((ingredient: Ingredients) => {
        ingredients.push(ingredient);
      });
    });
  });

  await generateShoppingList(profileId, ingredients); */

  console.log(plan.meals.sunday.breakfast);

  await db.collection("plans").findOneAndReplace({ _id: new ObjectId(plan?._id) }, plan);

  return Promise.resolve(recipie);
}

async function generateRecipies(restrictions: string, preferences: string, listado: any) {
  await client.connect()

  const rawOutput = await openApi.generateRecipies(restrictions, preferences, listado);

  const meals = JSON.parse(rawOutput as string);

  return meals;
}

export {
  draftPlan,
  updatePlanMeta,
  generatePlan,
  generatePlanFromDraft,
  savePlan,
  generateDocPlan,
  getPlan,
  getPlanById,
  getList,
  generateShoppingList,
  getPlans,
  assignPlan,
  deletePlan,
  editPlan,
  replaceRecipie,
  generateRecipies
}
