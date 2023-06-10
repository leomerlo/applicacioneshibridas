import { ObjectId } from "mongodb"

export interface Session {
  userName: string,
  password: string
}

export interface Account {
  _id: ObjectId,
  userName: string,
}