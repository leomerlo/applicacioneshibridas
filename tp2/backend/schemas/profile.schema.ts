import { ObjectId } from 'mongodb';
import yup from 'yup'

enum ProfileStatus {
  pending = 'pending',
  active = 'active',
  inactive = 'inactive'
}

enum ProfileType {
  user = 'user',
  doc = 'doc',
  admin = 'admin'
}

const profile = yup.object({
  accountId: yup.mixed<ObjectId>().required(),
  name: yup.string().trim(),
  status: yup.mixed<any>().oneOf([ProfileStatus.pending, ProfileStatus.active, ProfileStatus.inactive]).required(),
  restrictions: yup.string().trim(),
  preferences: yup.string().trim(),
  diners: yup.number().integer().positive(),
  docId: yup.mixed<ObjectId>(),
  accountType: yup.mixed<any>().oneOf([ProfileType.user, ProfileType.admin]).required(),
});

const docProfile = yup.object({
  accountId: yup.mixed<any>().required(),
  name: yup.string().trim(),
  status: yup.mixed<any>().oneOf([ProfileStatus.pending, ProfileStatus.active, ProfileStatus.inactive]).required(),
  idDocument: yup.string().trim().required(),
  idLicense: yup.string().trim().required(),
  accountType: yup.mixed<any>().oneOf([ProfileType.doc]).required(),
});

export {
  profile,
  docProfile,
  ProfileStatus,
  ProfileType
}