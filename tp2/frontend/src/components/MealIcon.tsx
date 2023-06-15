import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMugSaucer, faCarrot, faBowlFood } from "@fortawesome/free-solid-svg-icons"
import { MealTypes } from "./NextMeals/NextMealItem"

export enum IconSizes {
  small = "small",
  medium = "medium",
  large = "large"
}

export type Props = {
  type: MealTypes,
  size: IconSizes,
  background?: boolean
}

const MealIcon = (props: Props) => {

  const getIcon = (meal: MealTypes) => {
    switch (meal) {
      case MealTypes.breakfast:
        return faMugSaucer;

      case MealTypes.lunch:
        return faCarrot;
        
      case MealTypes.dinner:
        return faBowlFood;
    }
  }

  const getSize = (size: IconSizes) => {
    switch (size) {
      case IconSizes.small:
        return "p-2";

      case IconSizes.medium:
        return "p-4";

      case IconSizes.large:
        return "p-6";
    }
  }

  return (
    <span className={`${getSize(props.size)} rounded-full ${props.background ? "bg-primary-main" : ""} text-white flex justify-center items-center w-fit`}>
      <FontAwesomeIcon icon={getIcon(props.type)} />
    </span>
  )
}

export default MealIcon