import GoBack from "../components/GoBack"
import shoppingListImage from "../assets/cookChef.png"
import IngredientItem from "../components/IngredientItem"

const ShoppingListPage = () => {
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
        <li><IngredientItem ingredient="Dulce de leche - 100gr"></IngredientItem></li>
      </ul>
    </div>
  )
}

export default ShoppingListPage