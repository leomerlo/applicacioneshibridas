import { MongoClient, ObjectId } from 'mongodb'
import type { Recipie } from '../types/recipies.d.ts';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const planCollection = db.collection('plans')

async function getRecipie(recipie: string, profileId: ObjectId): Promise<Recipie> {
  await client.connect()
  return await planCollection.findOne<Recipie>({ "meals.$*.$*.name": { $eq: recipie }, profileId: new ObjectId(profileId) }) as Recipie;
}

async function likeRecipie(recipieId: string, profileId: string): Promise<void> {
  await client.connect()

  const recipie = await planCollection.findOne({ _id: new ObjectId(recipieId) }) as Recipie;

  if (recipie) {
    const isLiked = recipie.likes?.some(function (like) {
      return like.equals(new ObjectId(profileId));
    });
    if (!isLiked) {
      await planCollection.updateOne({ _id: new ObjectId(recipieId) }, { $push: { likes: new ObjectId(profileId) } });
    } else {
      throw new Error(`La receta ya esta likeada por este perfil`);
    }
  } else {
    throw new Error(`No se encontro la receta "${recipieId}"`);
  }
}

async function unlikeRecipie(recipieId: string, profileId: string): Promise<void> {
  await client.connect()

  const recipie = await planCollection.findOne({ _id: new ObjectId(recipieId) }) as Recipie;

  if (recipie) {
    let likedIndex = -1;
    const isLiked = recipie.likes?.some((like) => {
      return like.equals(new ObjectId(profileId))
    });
    if (isLiked) {
      await planCollection.updateOne({ _id: new ObjectId(recipieId) }, { $pull: { likes: new ObjectId(profileId) } });
    } else {
      throw new Error(`La receta no esta likeada por este perfil`);
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