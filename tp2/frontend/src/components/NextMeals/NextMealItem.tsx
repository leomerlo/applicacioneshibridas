import MealIcon, { IconSizes } from "../MealIcon";
import { useNavigate } from "react-router-dom";
import { usePlan } from "../../contexts/PlanContext";

export enum MealTypes {
  breakfast = 'Desayuno',
  lunch = 'Almuerzo',
  dinner = 'Cena'
}

export type Meal = {
  name: string;
  type: MealTypes;
} 

export type Props = {
  meal: Meal;
}

const NextMealItem = (props: Props) => {
  const { plan, setPlanSelectedMeal } = usePlan();
  const navigate = useNavigate();

  const recipieLinkHandler = () => {
    setPlanSelectedMeal(props.meal.type);

    navigate(`/recipie/${plan?._id}/${props.meal.name}`);
  }

  return (
    <button onClick={recipieLinkHandler} className="block w-full text-left cursor-pointer">
      <div className="flex gap-6">
        <div className="grow">
          <div className="flex items-center gap-6">
            <MealIcon background size={IconSizes.large} type={props.meal.type} />
            <div className="flex flex-col">
              <span className="font-semibold">{props.meal.name}</span>
              <span className="text-sm">{props.meal.type}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export default NextMealItem