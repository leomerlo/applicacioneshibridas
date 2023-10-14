import { ObjectId } from "mongodb";
import { ProfileStatus } from '../schemas/profile.schema.js';
import { ProfileType } from '../schemas/profile.schema.js';

export interface Profile {
  _id?: ObjectId,
  restrictions?: string,
  preferences?: string,
  diners?: number
  accountId: ObjectId,
  name: string,
  status: ProfileStatus,
  docId?: ObjectId,
  accountType: ProfileType.doc | ProfileType.user,
  email?: string
}

export interface DocProfile extends Profile {
  idDocument: string,
  idLicense: string
}
