import { useState } from "react"
import FalseCheck from "./FalseCheck";
import { useEffect } from "react";
import { Ingredients } from "../contexts/RecipiesContext";

export type Props = {
  ingredient: Ingredients;
  active?: boolean
  onCheck?: (checked: boolean, ingredient: string) => void,
}

const IngredientItem = (props: Props) => {

  const [checked, setChecked] = useState(false);

  const checkStep = () => {
    setChecked(!checked);
    props.onCheck?.(!checked, props.ingredient.name);
  }

  useEffect(() => {
    setChecked(props.active || false);
  }, [])

  return (
    <div className={`flex gap-4 p-4 ${checked ? 'bg-primary-secondary' : ''}`} onClick={checkStep}>
      <div>
        <FalseCheck checked={checked} onClick={checkStep} />
      </div>
      <div className="grow text-sm">
        <span className="capitalize">{props.ingredient.name}</span> - <span>{props.ingredient.quantity}</span> <span>{props.ingredient.unit}</span>
      </div>
    </div>
  )
}

export default IngredientItem