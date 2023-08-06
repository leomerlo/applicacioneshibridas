import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MealIcon, { IconSizes } from "../MealIcon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { useEffect, useState } from "react";

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
  date: string;
  meal: Meal;
}

const NextMealItem = (props: Props) => {
  const { patient, profile } = useProfile();
  const [recipieLink, setRecipieLink] = useState(`/recipie/${props.meal.name}`);

  const dayString = (day: string) => {
    switch (day) {
      case 'mon':
        return 'lun'

      case 'tue':
        return 'mar'

      case 'wed':
        return 'mie'
      
      case 'thu':
        return 'jue'

      case 'fri':
        return 'vie'

      case 'sat':
        return 'sáb'
      
      case 'sun':
        return 'dom'

      default:
        return ''
    }
  }

  useEffect(() => {
    if (profile.accountType === 'doc' && patient) {
      setRecipieLink(`/recipie/${patient._id}/${props.meal.name}`)
    }
  }, [patient]);

  return (
    <Link to={recipieLink}>
      <div className="flex gap-6">
        <div className="flex grow-0 flex-col items-center justify-center text-gray-70">
          <div className="bg-gray-10 text-center py-2 w-12">
            <span className="uppercase block">{dayString(props.day)}</span>
            <span className="block">{props.date}</span>
          </div>
        </div>
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