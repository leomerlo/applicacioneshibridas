import { ObjectId } from 'mongodb';
import * as planSchema from '../schemas/plan.schema.js';
import { Plan } from '../types/plan.js';
import * as openApi from './openApi.service.js';
import { Ingredients } from '../types/recipies.js';
import * as profileService from './profile.service.js';
import { Profile } from '../types/profile.js';
import { db, client } from './mongo.service.js';

async function generatePlan(profileId: ObjectId): Promise<void> {
  await client.connect()
  const profile = await profileService.getProfile(profileId) as Profile;
  if(!profile) {
    throw new Error('El perfil no existe');
  }

  const rawOutput = await openApi.generatePlan(profile.restrictions || '', profile.preferences || '');

  const meals = JSON.parse(rawOutput as string);

  planSchema.meals.validate(meals, { abortEarly: false, stripUnknown: true })
    .then(async (meals) => {
      const plan = {
        meals,
        profileId: new ObjectId(profileId)
      }
    
      const planExists = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) });
    
      if (planExists) {
        await db.collection("plans").findOneAndReplace({ profileId: new ObjectId(profileId) }, plan);
      } else {
        await db.collection("plans").insertOne(plan);
      }
    })
    .catch((err) => {
      console.log('Validation error', err);
    })
}

async function getPlan(profileId: string): Promise<Plan> {
  await client.connect()
  const plan = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { _id: 0, profileId: 0 } });
  return plan as Plan;
}

async function getList(profileId: string): Promise<Ingredients[]> {
  await client.connect()
  const list = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { _id: 0, profileId: 0, meals: 0 } });
  return list?.shoppingList as Ingredients[];
}

async function generateShoppingList(profileId: string, ingredients: Ingredients[]): Promise<void> {
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

  await db.collection("plans").updateOne({ profileId: new ObjectId(profileId) }, { $set: { shoppingList: unifiedList } });
}

export {
  generatePlan,
  getPlan,
  getList,
  generateShoppingList
}