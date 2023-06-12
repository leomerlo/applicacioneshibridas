import yup from 'yup'

const recipie = yup.object({
  name: yup.string().lowercase().required(),
  ingredients: yup.array().of(yup.object({
    name: yup.string().lowercase().required(),
    quantity: yup.number().required(),
    unit: yup.string()
  })).required(),
  instructions: yup.array().of(yup.string().required()).required(),
  likes: yup.array().of(yup.string().required()),
  nutrition: yup.object({
    calories: yup.number().required(),
    carbs: yup.number().required(),
    fat: yup.number().required(),
    protein: yup.number().required()
  }).required()
});

export {
  recipie
}