import { ObjectId } from 'mongodb'
import type { Recipie } from '../types/recipies.d.ts';
import { Plan } from '../types/plan.js';
import { db, client } from './mongo.service.js';
import * as openAIService from './openApi.service.js';
import { Profile } from '../types/profile.js';

const planCollection = db.collection('plans')
const likedCollection = db.collection('likes')
const profileCollection = db.collection('profiles')

async function getRecipie(recipie: string, profileId: ObjectId): Promise<Recipie> {
  await client.connect()

  const plan = await planCollection.findOne<Plan>({$or: [{ profileId: new ObjectId(profileId) },{ _id: new ObjectId(profileId) }]});

  if(!plan) {
    throw new Error('No se encontro el plan');
  }

  let returnRecipie: Recipie = {} as Recipie;
  // @ts-ignore
  Object.keys(plan?.meals).forEach((day) => {
    // @ts-ignore
    Object.keys(plan.meals[day]).forEach((meal) => {
      // @ts-ignore
      if (plan.meals[day][meal].name == recipie) {
        // @ts-ignore
        returnRecipie = plan.meals[day][meal] as Recipie;
      }
    })
  });

  if(!returnRecipie.name) {
    throw new Error(`No se encontro la receta "${recipie}"`);
  }

  return returnRecipie;
}

async function likeRecipie(recipieName: string, profileId: ObjectId): Promise<void> {
  await client.connect()

  const recipie = await getRecipie(recipieName, profileId);

  if (recipie) {
    await likedCollection.findOneAndUpdate(
      { name: recipieName },
      {
        $setOnInsert: { ...recipie, profileId: new ObjectId(profileId) }
      },
      {
        upsert: true,
      }
    );
  } else {
    throw new Error(`No se encontro la receta "${recipieName}"`);
  }
}

async function unlikeRecipie(recipieName: string, profileId: ObjectId): Promise<void> {
  await client.connect()

  const recipie = await likedCollection.findOneAndDelete({ name: recipieName, profileId: new ObjectId(profileId) });

  if (!recipie.value) {
    throw new Error(`No se encontro la receta "${recipieName}"`);
  }
}

async function getLikedRecipies(profileId: ObjectId): Promise<Recipie[]> {
  await client.connect()
  const likedRecipies = await likedCollection.find({ profileId: new ObjectId(profileId) }).toArray();
  return likedRecipies as Recipie[];
}

async function newRecipie(preferences: string, requirements: string, day: string, meal: string): Promise<Recipie> {
  await client.connect()
  const rawOutput = await openAIService.generateRecipie(preferences, requirements, '', day, meal);
  const recipie = JSON.parse(rawOutput as string);
  return recipie;
}

export {
  getRecipie,
  likeRecipie,
  unlikeRecipie,
  getLikedRecipies,
  newRecipie,
}