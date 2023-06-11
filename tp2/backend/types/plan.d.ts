import { ObjectId } from "mongodb";

export type Meals = {
  breakfast: string;
  lunch: string;
  dinner: string;
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