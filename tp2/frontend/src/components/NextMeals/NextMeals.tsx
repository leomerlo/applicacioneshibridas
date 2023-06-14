import NextMealItem, { MealTypes } from "./NextMealItem"
import DivideLine from "../../assets/dividerLine.png";

const NextMeals = () => {
  return (
    <div className="mt-6">
        <h2 className="text-3xl font-bold">Proximas Comidas</h2>
        <ul
          style={{'--image-url': `url(${DivideLine})`}}
          className="mt-6 bg-[image:var(--image-url)] bg-no-repeat bg-dividerLineDays"
        >
          <li className="mt-3"><NextMealItem day="Lun" date="09" meal={ { name: "Recetax", type: MealTypes.dinner } } /></li>
          <li className="mt-3"><NextMealItem day="Mar" date="09" meal={ { name: "Recetax", type: MealTypes.breakfast } } /></li>
          <li className="mt-3"><NextMealItem day="Mie" date="09" meal={ { name: "Recetax", type: MealTypes.lunch } } /></li>
        </ul>
      </div>
  )
}

export default NextMeals