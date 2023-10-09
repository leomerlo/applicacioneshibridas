import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MealIcon, { IconSizes } from "../MealIcon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useAsyncError, useLocation, useParams } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { useEffect, useState } from "react";
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
  day: string;
  meal: Meal;
}

const NextMealItem = (props: Props) => {
  const { patient } = useProfile();
  const { plan } = usePlan();
  const { id } = useParams();
  const location = useLocation();
  const [recipieLink, setRecipieLink] = useState('');

  useEffect(() => {
    if (location.pathname.includes('patient') && patient) {
      setRecipieLink(`/recipie/${patient._id}/${props.meal.name}`)
    }
  }, [patient]);

  useEffect(() => {
    if( !id ) {
      setRecipieLink(`/recipie/${plan?._id}/${props.meal.name}`);
    } else {
      setRecipieLink(`/recipie/${id}/${props.meal.name}`);
    }
  }, [plan]);

  return (
    <Link to={recipieLink}>
      <div className="flex gap-6">
        <div className="grow border rounded-lg border-gray-30">
          <div className="flex items-center gap-4 p-4">
            <MealIcon background size={IconSizes.small} type={props.meal.type} />
            <div className="flex flex-col">
              <span className="text-gray-80 font-semibold">{props.meal.name}</span>
              <span className="text-sm text-gray-60">{props.meal.type}</span>
            </div>
            <div className="grow flex justify-end items-center px-4 text-primary-main">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NextMealItem