import { MongoClient, ObjectId } from 'mongodb'
import * as recipieSchema from '../schemas/recipies.schema.js';
import type { Recipie } from '../types/recipies.d.ts';
import * as openAiService from './openApi.service.js';
import * as profileService from './profile.service.js';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const recipiesCollection = db.collection('recipies')

async function getRecipie(recipie: string): Promise<Recipie | void> {
  await client.connect()
  return await recipiesCollection.findOne<Recipie>({ name: recipie.toLowerCase() }) as Recipie;
}

async function generateRecipie(recipie: string, profileId: ObjectId): Promise<ObjectId | void> {
  await client.connect()
    
  // Generate the recipie
  const profile = await profileService.getProfile(profileId);
  const diners = profile?.diners || 1;
  const rawOutput = await openAiService.generateRecipie(recipie, diners);
  // const rawOutput = {name:"Oats and banana smoothie bowl",ingredients:[{name:"Oats",quantity:"100",unit:"gr"},{name:"Banana",quantity:"1",unit:"each"},{name:"Vanilla Extract",quantity:"1",unit:"tsp"},{name:"Coconut Milk",quantity:"250",unit:"ml"},{name:"Honey",quantity:"2",unit:"tsp"}],instructions:["Peel the banana and cut it into slices","Place the oats, banana slices, coconut milk, vanilla extract, and honey in a blender","Blend until it reaches desired consistency","Pour into a bowl","Top with your favorite toppings","Enjoy!"]}

  console.log(`Recipie "${recipie}" generated, parsing`);
  const newRecipie = JSON.parse(rawOutput as string);

  // Validate the recipie
  console.log(`Validating new recipie for "${recipie}"`);
  console.log("Recipie Ingredients", newRecipie.ingredients[0]);
  await recipieSchema.recipie.validate(newRecipie, { abortEarly: false, stripUnknown: true })
  .then(async (newRecipie) => {
    // Save the recipie
    const result = await recipiesCollection.insertOne(newRecipie);
    return result;
  });
}

async function likeRecipie(recipieId: string, profileId: string): Promise<void> {
  await client.connect()

  const recipie = await recipiesCollection.findOne({ _id: new ObjectId(recipieId) }) as Recipie;

  if (recipie) {
    const isLiked = recipie.likes?.some(function (like) {
      return like.equals(new ObjectId(profileId));
    });
    if (!isLiked) {
      await recipiesCollection.updateOne({ _id: new ObjectId(recipieId) }, { $push: { likes: new ObjectId(profileId) } });
    } else {
      throw new Error(`La receta ya esta likeada por este perfil`);
    }
  } else {
    throw new Error(`No se encontro la receta "${recipieId}"`);
  }
}

async function unlikeRecipie(recipieId: string, profileId: string): Promise<void> {
  await client.connect()

  const recipie = await recipiesCollection.findOne({ _id: new ObjectId(recipieId) }) as Recipie;

  if (recipie) {
    let likedIndex = -1;
    const isLiked = recipie.likes?.some((like) => {
      return like.equals(new ObjectId(profileId))
    });
    if (isLiked) {
      await recipiesCollection.updateOne({ _id: new ObjectId(recipieId) }, { $pull: { likes: new ObjectId(profileId) } });
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
  generateRecipie
}