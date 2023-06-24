import yup from 'yup'

const recipie = yup.object({
  name: yup.string().lowercase().required(),
  ingredients: yup.array().of(yup.object({
    name: yup.string().lowercase().required(),
    quantity: yup.number().required(),
    unit: yup.string().oneOf(['gr', 'kg', 'ml', 'l', 'un'])
  })).required(),
  instructions: yup.array().of(yup.string().required()).required(),
  likes: yup.array().of(yup.string().required()),
  nutrition: yup.object({
    calorias: yup.number().required(),
    carbohidratos: yup.number().required(),
    grasas: yup.number().required(),
    proteinas: yup.number().required()
  }).required()
});

export {
  recipie
}