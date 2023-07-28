import yup from 'yup'

enum ProfileStatus {
  pending = 'pending',
  active = 'active',
  inactive = 'inactive'
}

enum ProfileType {
  user = 'user',
  doc = 'doc'
}

const profile = yup.object({
  accountId: yup.string().trim().required(),
  name: yup.string().trim(),
  status: yup.mixed<any>().oneOf([ProfileStatus.pending, ProfileStatus.active, ProfileStatus.inactive]).required(),
  restrictions: yup.string().trim(),
  preferences: yup.string().trim(),
  diners: yup.number().integer().positive(),
  docId: yup.string().trim(),
});

const docProfile = yup.object({
  accountId: yup.string().trim().required(),
  name: yup.string().trim(),
  status: yup.mixed<any>().oneOf([ProfileStatus.pending, ProfileStatus.active, ProfileStatus.inactive]).required(),
  email: yup.string().trim().required(),
  idDocument: yup.string().trim().required(),
  idLicense: yup.string().trim().required(),
});

export {
  profile,
  docProfile,
  ProfileStatus,
  ProfileType
}