import { MongoClient, ObjectId } from 'mongodb'
import type { Recipie } from '../types/recipies.d.ts';
import { Plan } from '../types/plan.js';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const planCollection = db.collection('plans')
const likedCollection = db.collection('likes')

async function getRecipie(recipie: string, profileId: ObjectId): Promise<Recipie> {
  await client.connect()
  const plan = await planCollection.findOne<Plan>({ profileId: new ObjectId(profileId) });
  let returnRecipie: Recipie = {} as Recipie;
  Object.keys(plan?.meals).forEach((day) => {
    Object.keys(plan.meals[day]).forEach((meal) => {
      if (plan.meals[day][meal].name == recipie) {
        returnRecipie = plan.meals[day][meal] as Recipie;
      }
    })
  });

  return returnRecipie;
}

async function likeRecipie(recipieName: string, profileId: ObjectId): Promise<void> {
  await client.connect()

  const recipie = await getRecipie(recipieName, profileId);

  if (recipie) {
    if (!recipie.likes) {
      await likedCollection.insertOne({ ...recipie, profileId: new ObjectId(profileId) });
    } else {
      throw new Error(`La receta ya esta likeada`);
    }
  } else {
    throw new Error(`No se encontro la receta "${recipieName}"`);
  }
}

async function unlikeRecipie(recipieId: string, profileId: ObjectId): Promise<void> {
  await client.connect()

  const recipie = await getRecipie(recipieId, profileId);

  if (recipie) {
    if (recipie.likes) {
      await likedCollection.deleteOne({ ...recipie, profileId: new ObjectId(profileId) });
    } else {
      throw new Error(`La receta no esta likeada`);
    }
  } else {
    throw new Error(`No se encontro la receta "${recipieId}"`);
  }
}

export {
  getRecipie,
  likeRecipie,
  unlikeRecipie,
}