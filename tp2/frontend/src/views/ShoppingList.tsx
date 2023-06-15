import GoBack from "../components/GoBack"
import shoppingListImage from "../assets/shopping.png"
import IngredientItem from "../components/IngredientItem"
import { usePlan } from "../contexts/PlanContext"

const ShoppingListPage = () => {
  const { shoppingList } = usePlan();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <GoBack />
      </div>
      <div className="mx-auto w-fit">
        <img src={shoppingListImage} />
      </div>
      <h1 className="text-4xl mt-6">Lista de compras</h1>
      <ul className="mt-4">
        { Object.keys(shoppingList).every((key) => {
          <li key={key}>
            <IngredientItem ingredient={shoppingList[key]} />
          </li>
        })}
      </ul>
    </div>
  )
}

export default ShoppingListPage