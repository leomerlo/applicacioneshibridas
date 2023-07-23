import RecipieStep from "./RecipieStep"
import DivideLine from "../assets/dividerLine.png";
import { useRecipie } from "../contexts/RecipiesContext";

const RecipieSteps = () => {
  const { recipie, userSteps, setSteps } = useRecipie();

  const onCheckHandler = (checked: boolean, step: number) => {
    if (checked) {
      // @ts-ignore
      userSteps.push(step);
      setSteps(userSteps);
    } else {
      setSteps(userSteps.filter((s) => s !== step));
    }
  };

  return (
    <>
      <ul
        // @ts-ignore
        style={{'--image-url': `url(${DivideLine})`}}
        className="mt-8 bg-[image:var(--image-url)] bg-no-repeat bg-dividerLineSteps"
      >
        { recipie.instructions.map((instruction, index) => {
          return <li key={index}>
            {/* @ts-ignore */}
            <RecipieStep active={userSteps.includes(index)} step={index} text={instruction} onCheck={onCheckHandler} />
          </li>
        })}
      </ul>
    </>
  )
}

export default RecipieSteps