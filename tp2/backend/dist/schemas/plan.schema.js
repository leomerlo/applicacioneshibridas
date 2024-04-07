import yup from 'yup';
const meal = yup.object({
    name: yup.string().required(),
    ingredients: yup.array().of(yup.object({
        name: yup.string().lowercase().required(),
        quantity: yup.mixed().required(),
        unit: yup.string()
    })).required(),
    instructions: yup.array().of(yup.string().required()).required(),
    likes: yup.array().of(yup.string().required()),
    nutrition: yup.object({
        calorias: yup.number(),
        carbohidratos: yup.number(),
        grasas: yup.number(),
        proteinas: yup.number()
    }).required()
});
const day = yup.object({
    breakfast: meal,
    lunch: meal,
    dinner: meal
});
const meals = yup.object({
    monday: day,
    tuesday: day,
    wednesday: day,
    thursday: day,
    friday: day,
    saturday: day,
    sunday: day
});
export { meals };
