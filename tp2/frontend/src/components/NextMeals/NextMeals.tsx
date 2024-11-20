import NextMealItem, { MealTypes } from "./NextMealItem"
import { Plan, usePlan } from "../../contexts/PlanContext";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";

export type nextMeal = {
  name: string,
  meal: MealTypes
}

interface Props {
  plan: Plan
}

const NextMeals = (props: Props) => {
  const DropdownItems = [
    {
      label: 'Lunes',
      value: 'monday'
    },
    {
      label: 'Martes',
      value: 'tuesday'
    },
    {
      label: 'Miércoles',
      value: 'wednesday'
    },
    {
      label: 'Jueves',
      value: 'thursday'
    },
    {
      label: 'Viernes',
      value: 'friday'
    },
    {
      label: 'Sabado',
      value: 'saturday'
    },
    {
      label: 'Domingo',
      value: 'sunday'
    }
  ];
  const [plan, setPlan] = useState<Plan>(props.plan);
  const { today, todayString } = usePlan();
  const [nextMeals, setNextMeals] = useState<nextMeal[]>([]);
  const [selectedDay, setSelectedDay] = useState<{
    label: string,
    value: string
  }>(DropdownItems.find((e) => e.value === todayString) || DropdownItems[0]);

  useEffect(() => {
    setPlan(props.plan);
  }, [props.plan]);

  const generateNextMeals = (): nextMeal[] => {
    let nextMeals: nextMeal[] = [];
    const todayString = selectedDay.value;
    nextMeals = [
      {
        day: todayString?.substring(0, 3),
        date: today.getDate().toString(),
        // @ts-ignore
        name: plan.meals[todayString].breakfast.name,
        meal: MealTypes.breakfast
      },
      {
        day: todayString?.substring(0, 3),
        date: today.getDate().toString(),
        // @ts-ignore
        name: plan.meals[todayString].lunch.name,
        meal: MealTypes.lunch
      },
      {
        day: todayString?.substring(0, 3),
        date: today.getDate().toString(),
        // @ts-ignore
        name: plan.meals[todayString].dinner.name,
        meal: MealTypes.dinner
      }
    ]
    return nextMeals;
  }

  const onDayChange = async (day: string) => {
    const selectedDay = DropdownItems.find((item) => item.value === day);
    await setSelectedDay(selectedDay ? selectedDay : DropdownItems[0]);
  }

  useEffect(() => {
    setNextMeals(generateNextMeals());
  }, [plan]);

  useEffect(() => {
    const today = DropdownItems.find((item) => item.value === todayString);
    setSelectedDay(today ? today : DropdownItems[0]);
  }, []);

  useEffect(() => {
    setNextMeals(generateNextMeals());
  }, [selectedDay]);

  return (
    <div className="flex flex-col gap-8">
        <Dropdown buttonLabel={selectedDay.label} items={DropdownItems} onSelect={onDayChange} />
        <ul className="flex flex-col gap-8">
          { nextMeals.map((meal, index) => {
            return <li key={index}>
              <NextMealItem day="" meal={ { name: meal.name, type: meal.meal } } />
            </li>
          })} 
        </ul>
      </div>
  )
}

export default NextMeals