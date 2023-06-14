import { useState } from "react"
import FalseCheck from "./FalseCheck";

export type Props = {
  ingredient: string;
}

const IngredientItem = (props: Props) => {

  const [checked, setChecked] = useState(false);

  const checkStep = () => {
    setChecked(!checked);
  }

  return (
    <div className={`flex gap-4 p-4 ${checked ? 'bg-primary-secondary' : ''}`} onClick={checkStep}>
      <div>
        <FalseCheck checked={checked} onClick={checkStep} />
      </div>
      <div className="grow">
        <span className="text-sm">{props.ingredient}</span>
      </div>
    </div>
  )
}

export default IngredientItem