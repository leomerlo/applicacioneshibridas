import { useEffect, useState } from 'react';
import { Plan, usePlan } from '../../contexts/PlanContext';
import { MealTypes } from './NextMealItem';
import { nextMeal } from './NextMeals';
import NextMealItem from './NextMealItem';
import DivideLine from "../../assets/dividerLine.png";

export type PatientNextMealProps = {
  plan: Plan,
}

const PatientNextMeal = (props: PatientNextMealProps) => {
  const { today, todayString, nextMeal } = usePlan();
  const [nextMeals, setNextMeals] = useState<nextMeal[]>([]);

  const generateNextMeals = (): nextMeal[] => {
    const nextMeals: nextMeal[] = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let date = 0;
    let internalTodayString = todayString;
    let internalNextMeal = nextMeal;
    if(todayString != '' && nextMeal != '') {
      do {
        switch(internalNextMeal) {
          case 'breakfast':
            internalNextMeal = 'lunch';
            break;
          case 'lunch':
            internalNextMeal = 'dinner';
            break;
          case 'dinner':
            internalTodayString = days[days.indexOf(internalTodayString) + 1];
            date = date + 1;
            internalNextMeal = 'breakfast';
            break;
        }
        if(internalTodayString !== undefined) {
          nextMeals.push({
            day: internalTodayString?.substring(0, 3),
            date: (today.getDate() + date).toString(),
            // @ts-ignore
            name: props.plan.meals[internalTodayString][internalNextMeal].name,
            // @ts-ignore
            meal: MealTypes[internalNextMeal],
          });
        } else {
          internalTodayString = 'monday';
          internalNextMeal = 'breakfast';
        }
      } while(nextMeals.length < 19)
      return nextMeals;
    }

    return [];
  }

  useEffect(() => {
    setNextMeals(generateNextMeals());
  }, []);

  return (
    <div className="mt-6">
        <h2 className="text-3xl font-bold">Proximas Comidas</h2>
        <ul
          // @ts-ignore
          style={{'--image-url': `url(${DivideLine})`}}
          className="mt-6 bg-[image:var(--image-url)] bg-no-repeat bg-dividerLineDays"
        >
          { nextMeals.map((meal, index) => {
            return <li className="mt-3" key={index}>
              <NextMealItem day={meal.day} date={meal.date} meal={ { name: meal.name, type: meal.meal } } />
            </li>
          })} 
        </ul>
      </div>
  )
}

export default PatientNextMeal