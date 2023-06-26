import GoBack from "../components/GoBack"
import shoppingListImage from "../assets/shopping.png"
import IngredientItem from "../components/IngredientItem"
import { useEffect, useState } from "react"
import planService from "../services/plan.service"
import { ShoppingListIngredient } from "../contexts/PlanContext"

const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    planService.getShoppingList()
    .then((res) => {
      const sorted = res.data.sort((a: ShoppingListIngredient, b: ShoppingListIngredient) => a.name.localeCompare(b.name));
      setShoppingList(sorted)
    });
  }, []);

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
        { Array.from(Object.keys(shoppingList)).map((key) => (
          <li key={key}>
            <IngredientItem ingredient={shoppingList[key]} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ShoppingListPage