import yup from 'yup'

const recipie = yup.object({
  name: yup.string().lowercase().required(),
  ingredients: yup.array().of(yup.object({
    name: yup.string().lowercase().required(),
    quantity: yup.number().required(),
    unit: yup.string()
  })).required(),
  instructions: yup.array().of(yup.string().required()).required(),
  likes: yup.array().of(yup.string().required())
});

export {
  recipie
}