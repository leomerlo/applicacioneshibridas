import { ObjectId } from "mongodb";
import { Recipie } from "./recipies";

export type Meals = {
  breakfast: Recipie;
  lunch: Recipie;
  dinner: Recipie;
}

export interface Plan {
  _id?: ObjectId;
  meals: {
    monday: Meals,
    tuesday: Meals,
    wednesday: Meals,
    thursday: Meals,
    friday: Meals,
    saturday: Meals,
    sunday: Meals,
  },
  profileId?: ObjectId,
  shoppingList?: {
    [key: string]: string | number
  }[]
}