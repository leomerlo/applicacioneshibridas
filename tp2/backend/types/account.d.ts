import { ObjectId } from "mongodb"
import { Request } from "express"
import { ProfileType } from "./profile"

export interface Session {
  userName: string,
  password: string,
  type?: ProfileType
}

export interface DocSession extends Session {
  idDocument: string,
  idLicense: string,
  email: string,
}

export interface Account {
  _id: ObjectId,
  userName: string,
}

export interface RequestWithAccount extends Request {
  account: Account
}