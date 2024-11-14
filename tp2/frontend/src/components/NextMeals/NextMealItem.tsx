import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MealIcon, { IconSizes } from "../MealIcon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { useState } from "react";
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
  const { patient } = useProfile();
  const { plan, setPlanSelectedMeal } = usePlan();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [recipieLink, setRecipieLink] = useState('');

  const recipieLinkHandler = () => {
    setPlanSelectedMeal(props.meal.type);

    if (location.pathname.includes('patient') && patient) {
      setRecipieLink(`/recipie/${patient._id}/${props.meal.name}`)
    } else if( !id ) {
      setRecipieLink(`/recipie/${plan?._id}/${props.meal.name}`);
    } else {
      setRecipieLink(`/recipie/${id}/${props.meal.name}`);
    }

    navigate(recipieLink);
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