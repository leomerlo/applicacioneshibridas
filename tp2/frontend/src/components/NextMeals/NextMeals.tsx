import NextMealItem, { MealTypes } from "./NextMealItem"
import { usePlan } from "../../contexts/PlanContext";
import { useEffect, useState } from "react";

export type nextMeal = {
  name: string,
  meal: MealTypes
}

const NextMeals = () => {
  const { plan, today, todayString, nextMeal } = usePlan();
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
            name: plan.meals[internalTodayString][internalNextMeal].name,
            // @ts-ignore
            meal: MealTypes[internalNextMeal],
          });
        } else {
          internalTodayString = 'monday';
          internalNextMeal = 'breakfast';
        }
      } while(nextMeals.length < 3)
      return nextMeals;
    }

    return [];
  }

  useEffect(() => {
    if(plan){
      setNextMeals(generateNextMeals());
    }
  }, [plan]);

  return (
    <div className="mt-6">
        <h2 className="text-3xl font-bold">Siguientes comidas</h2>
        <ul
          // @ts-ignore
          className="mt-6"
        >
          { nextMeals.map((meal, index) => {
            return <li className="mt-3" key={index}>
              <NextMealItem day="" meal={ { name: meal.name, type: meal.meal } } />
            </li>
          })} 
        </ul>
      </div>
  )
}

export default NextMeals