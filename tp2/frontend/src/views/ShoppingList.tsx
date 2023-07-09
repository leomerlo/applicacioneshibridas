import GoBack from "../components/GoBack"
import shoppingListImage from "../assets/shopping.png"
import IngredientItem from "../components/IngredientItem"
import { useEffect, useState } from "react"
import planService from "../services/plan.service"
import { Ingredients } from "../contexts/RecipiesContext"

const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    planService.getShoppingList()
    .then((res) => {
      setShoppingList(res.data)
    });
  }, []);

  const keyToTitle = (key: string) => {
    switch (key) {
      case 'meats':
        return 'Carniceria';
      case 'produce':
        return 'Verduleria';
      case 'others':
      default:
        return 'Almacen';
    }
  }

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
          <>
            <li key={key} className="p-4 font-bold text-xl">
              <span>{ keyToTitle(key) }</span>
            </li>
            { shoppingList[key].map((ingredient: Ingredients) => (
              <li key={key + ingredient.name}><IngredientItem ingredient={ingredient} /></li>
            )) }
          </>
        ))}
      </ul>
    </div>
  )
}

export default ShoppingListPage