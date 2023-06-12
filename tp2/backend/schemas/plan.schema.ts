import yup from 'yup'

const meal = yup.object({
  name: yup.string().required(),
})

const day = yup.object({
  breakfast: meal,
  lunch: meal,
  dinner: meal
})

const meals = yup.object({
  monday: day,
  tuesday: day,
  wednesday: day,
  thursday: day,
  friday: day,
  saturday: day,
  sunday: day
});

export {
  meals
}