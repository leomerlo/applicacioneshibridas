import { useState } from "react"
import FalseCheck from "./FalseCheck";

export type Props = {
  step: number,
  text: string,
  onCheck?: () => void,
}

const RecipieStep = (props: Props) => {

  const [checked, setChecked] = useState(false);

  const checkStep = () => {
    setChecked(!checked);
    props.onCheck?.();
  }

  return (
    <div className="flex gap-4 mt-4" onClick={checkStep}>
      <div>
        <FalseCheck checked={checked} onClick={checkStep} />
      </div>
      <div className="grow pb-4 border-b border-b-gray-40">
        <p className={`${checked ? "text-gray-60" : "text-gray-80"}`}>
          <span className="font-bold me-1">{props.step}</span> 
          {props.text}
        </p>
      </div>
    </div>
  )
}

export default RecipieStep