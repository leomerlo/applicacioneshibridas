import yup from 'yup'

const profile = yup.object({
  name: yup.string().trim(),
  restrictions: yup.string().trim(),
  preferences: yup.string().trim(),
  diners: yup.number().integer().positive()
});

export {
  profile
}