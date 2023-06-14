import IngredientItem from "./IngredientItem"

const RecipieIngredients = () => {
  return (
    <ul className="mt-4">
      <li>
        <IngredientItem ingredient="2 tazas de quinoa" />
      </li>
      <li>
        <IngredientItem ingredient="1 Palta madura" />
      </li>
    </ul>
  )
}

export default RecipieIngredients