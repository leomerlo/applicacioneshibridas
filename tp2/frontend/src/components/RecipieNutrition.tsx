import { useRecipie } from "../contexts/RecipiesContext";

const RecipieNutrition = () => {
  const { recipie } = useRecipie();

  const keys = Object.keys(recipie.nutrition);

  return (
    <ul className="text-sm mt-4">
      { keys.map((key) => {          
        return <li className="p-4" key={key}>
          <span className="capitalize">{key}: {recipie.nutrition[key]}</span>
        </li>
      })}
    </ul>
  )
}

export default RecipieNutrition