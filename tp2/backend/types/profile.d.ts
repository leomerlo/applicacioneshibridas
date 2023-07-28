import { ObjectId } from "mongodb";
import { ProfileStatus } from '../schemas/profile.schema.js';

export interface Profile {
  _id?: ObjectId,
  restrictions?: string,
  preferences?: string,
  diners?: number
  accountId: ObjectId,
  name: string,
  status: ProfileStatus
}

export interface DocProfile extends Profile {
  email: string,
  idDocument: string,
  idLicense: string
}
