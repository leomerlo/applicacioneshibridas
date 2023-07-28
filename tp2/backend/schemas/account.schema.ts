import yup from 'yup'
import { ProfileType } from './profile.schema.js';

const account = yup.object({
  userName: yup.string().trim().required().min(3),
  password: yup.string().required().min(3),
  type: yup.mixed<any>().oneOf([ProfileType.user, ProfileType.doc]),
});

export {
  account
}