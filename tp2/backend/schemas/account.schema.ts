import yup from 'yup'
import { ProfileType } from './profile.schema.js';
import { ObjectId } from "mongodb";

const account = yup.object({
  _id: yup.mixed<ObjectId>(),
  userName: yup.string().trim().required().min(3),
  password: yup.string().required().min(3),
  type: yup.mixed<any>().oneOf([ProfileType.user, ProfileType.doc, ProfileType.admin]),
});

export {
  account
}