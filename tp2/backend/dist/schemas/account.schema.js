import yup from 'yup';
import { ProfileType } from './profile.schema.js';
const account = yup.object({
    _id: yup.mixed(),
    userName: yup.string().trim().required().min(3),
    password: yup.string().required().min(3),
    type: yup.mixed().oneOf([ProfileType.user, ProfileType.doc, ProfileType.admin]),
});
export { account };
