import IngredientItem from "./IngredientItem"
import { useRecipie } from "../contexts/RecipiesContext";

const RecipieIngredients = () => {
  const { recipie, userIngredients, setIngredients } = useRecipie();

  const onCheckHandler = (checked: boolean, ingredient: string) => {
    if (checked) {
      userIngredients.push(ingredient);
      setIngredients(userIngredients);
    } else {
      setIngredients(userIngredients.filter((i) => i !== ingredient));
    }
  };

  return (
    <ul className="mt-4">
      { recipie.ingredients.map((ingredient, index) => {
        return <li key={index}>
          <IngredientItem ingredient={ingredient} onCheck={onCheckHandler} />
        </li>
      })}
    </ul>
  )
}

export default RecipieIngredients