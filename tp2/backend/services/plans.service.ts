import { MongoClient, ObjectId } from 'mongodb'
import * as planSchema from '../schemas/plan.schema.js';
import { Plan } from '../types/plan.js';
import * as openApi from './openApi.service.js';
import { Ingredients } from '../types/recipies.js';
import * as profileService from './profile.service.js';
import { Profile } from '../types/profile.js';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")

async function generatePlan(profileId: ObjectId): Promise<void> {
  const profile = profileService.getProfile(profileId);
  const rawOutput = await openApi.generatePlan(profile.restrictions, profile.preferences);
  // const rawOutput = "{\"monday\":{\"breakfast\":\"Overnight Oats\",\"lunch\":\"Mixed Salad with Grilled Tofu Avocado and Quinoa\",\"dinner\":\"Rainbow Vegetable Stir-Fry with Tofu\"},\"tuesday\":{\"breakfast\":\"Smoothie Bowl\",\"lunch\":\"Chickpea Avocado Wraps\",\"dinner\":\"Baked Veggie Fritters with Coconut Amchoor Sauce\"},\"wednesday\":{\"breakfast\":\"Tofu Scramble\",\"lunch\":\"Spicy Roasted Veggie and Quinoa Bowls\",\"dinner\":\"Vegan Mac and Cheese\"},\"thursday\":{\"breakfast\":\"Creamy Coconut Oatmeal\",\"lunch\":\"Mixed Greens and Veggie Quinoa Bowls\",\"dinner\":\"Mexican Pizza with Tempeh\"},\"friday\":{\"breakfast\":\"Avocado Toast with Almond Butter\",\"lunch\":\"Japanese Sushi Bowl\",\"dinner\":\"Thai Coconut Soup with Tofu and Mushrooms\"},\"saturday\":{\"breakfast\":\"Carrot Cake Oatmeal\",\"lunch\":\"Tofu Kale Salad\",\"dinner\":\"Roasted Veggies and Beans\"},\"sunday\":{\"breakfast\":\"Chia Pudding\",\"lunch\":\"Veggie Burgers\",\"dinner\":\"Gnocchi with Vegan Cream Cheese Sauce\"}}";

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
      console.log(err);
    })
}

async function getPlan(profileId: string): Promise<Plan> {
  const plan = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { _id: 0, profileId: 0 } });
  return plan as Plan;
}

async function getList(profileId: string): Promise<Ingredients[]> {
  const list = await db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { _id: 0, profileId: 0, meals: 0 } });
  return list?.shoppingList as Ingredients[];
}

async function generateShoppingList(profileId: string, ingredients: Ingredients[]): Promise<void> {
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