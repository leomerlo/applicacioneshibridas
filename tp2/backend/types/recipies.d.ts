import { ObjectId } from "mongodb";

export type Ingredients = {
  name: string;
  quantity: number;
  unit: string;
}

export type Recipie = {
  _id?: ObjectId;
  name: string;
  ingredients: Ingredients[];
  instructions: string[];
  likes?: ObjectId[]
}