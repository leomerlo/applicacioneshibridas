import { ObjectId } from "mongodb"
import { Request } from "express"

export interface Session {
  userName: string,
  password: string
}

export interface Account {
  _id: ObjectId,
  userName: string,
}

export interface Profile {
  _id?: ObjectId,
  accountId: ObjectId,
  userName: string,
  name?: string,
  restrictions?: string,
  preferences?: string,
}

export interface RequestWithAccount extends Request {
  account: Account
}