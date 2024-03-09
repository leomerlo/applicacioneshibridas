import { useEffect, useState } from 'react';
import { Plan, usePlan } from '../../contexts/PlanContext';
import { nextMeal } from './NextMeals';
import NextMealItem, { MealTypes } from './NextMealItem';
import DivideLine from "../../assets/dividerLine.png";

export type PatientNextMealProps = {
  plan: Plan,
  day: string
}

const PatientNextMeal = (props: PatientNextMealProps) => {
  const [meals, setMeals] = useState<nextMeal[]>([]);
  const { plan } = usePlan();

  useEffect(() => {
    let dayMeals: nextMeal[] = [];
    if (!props.plan) {
      dayMeals = plan.meals[props.day];
    } else {
      dayMeals = props.plan.meals[props.day]
    }
    setMeals(dayMeals);
  }, [props.day]);

  return (
    <div className="mt-6">
      <ul
        // @ts-ignore
        style={{'--image-url': `url(${DivideLine})`}}
        className="mt-6"
      >
        {
          Object.keys(meals).map((key: string, index) => (
            <li className="mt-3" key={index}>
              <NextMealItem meal={ { name: meals[key as any].name, type: MealTypes[key] } } />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default PatientNextMeal