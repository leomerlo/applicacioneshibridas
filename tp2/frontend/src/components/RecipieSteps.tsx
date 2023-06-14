import RecipieStep from "./RecipieStep"
import DivideLine from "../assets/dividerLine.png";

const RecipieSteps = () => {
  return (
    <ul
      style={{'--image-url': `url(${DivideLine})`}}
      className="mt-8 bg-[image:var(--image-url)] bg-no-repeat bg-dividerLineSteps"
    >
      <li>
        <RecipieStep step={1} text="Cocinar la quinoa" />
      </li>
      <li>
        <RecipieStep step={2} text="Cortar la palta" />
      </li>
    </ul>
  )
}

export default RecipieSteps