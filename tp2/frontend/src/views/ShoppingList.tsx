import GoBack from "../components/GoBack"
import shoppingListImage from "../assets/shopping.png"
import IngredientItem from "../components/IngredientItem"
import { useEffect, useState } from "react"
import planService from "../services/plan.service"
import { Ingredients } from "../contexts/RecipiesContext"
import { useNotifications } from "../contexts/NotificationsContext"
import Loading from "../components/Loading"

const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const { updateNotifications } = useNotifications();

  useEffect(() => {
    setLoadingList(true);
    planService.getShoppingList()
    .then((res) => {
      setLoadingList(false);
      if(res.status === 200) {
        setShoppingList(res.data);
      } else {
        updateNotifications({
          variant: 'error',
          message: 'Error al obtener la lista de compras'
        });
      }
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
      { loadingList ? <Loading action="Estamos cargando tu lista de compras" /> : <>
          <h1 className="text-4xl mt-6">Lista de compras</h1>
          <ul className="mt-4">
            { Array.from(Object.keys(shoppingList)).map((key) => (
              <>
                <li key={key} className="p-4 font-bold text-xl">
                  <span>{ keyToTitle(key) }</span>
                </li>
                { /* @ts-ignore */ }
                { shoppingList[key].map((ingredient: Ingredients) => (
                  <li key={key + ingredient.name}><IngredientItem ingredient={ingredient} /></li>
                )) }
              </>
            ))}
          </ul>
          <div className="mx-auto w-fit my-4">
            <img src={shoppingListImage} />
          </div>
        </>
      }
    </div>
  )
}

export default ShoppingListPage