import { createContext, useState, useEffect, PropsWithChildren, useContext, useCallback } from "react"
import planService from "../services/plan.service"
import { MealTypes } from "../components/NextMeals/NextMealItem";

export type Meals = {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface ShoppingList {
  [key: string]: {
    name: string,
    quantity: number,
    unit: string
  }
}

export interface Plan {
  _id?: string;
  meals: {
    monday: Meals,
    tuesday: Meals,
    wednesday: Meals,
    thursday: Meals,
    friday: Meals,
    saturday: Meals,
    sunday: Meals,
  },
  profileId?: string,
  shoppingList?: ShoppingList
}

const emptyPlan: {
  plan: Plan 
  today: Date,
  nextMeal: string,
  todayString: string,
  nextMealType: MealTypes,
  shoppingList: ShoppingList
} = {
  plan: {
    meals: {
      monday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      tuesday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      wednesday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      thursday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      friday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      saturday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      sunday: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
    }
  },
  today: new Date(),
  nextMeal: '',
  todayString: '',
  nextMealType: MealTypes.breakfast,
  shoppingList: {}
}

const PlanContext = createContext(emptyPlan)

function usePlan(){
  return useContext(PlanContext)
}

function PlanProvider({children}: PropsWithChildren){
  const [plan, setPlan] = useState<Plan>(emptyPlan.plan)
  const [today, setToday] = useState<Date>(emptyPlan.today);
  const [todayString, setTodayString] = useState<string>('');
  const [nextMeal, setNextMeal] = useState<string>(emptyPlan.nextMeal);
  const [nextMealType, setNextMealType] = useState<MealTypes>(emptyPlan.nextMealType);
  const [shoppingList, setShoppingList] = useState<ShoppingList>(emptyPlan.shoppingList);

  useEffect(() => {
    setToday(new Date());

    planService.getPlan()
    .then((plan) => {
      setPlan(plan.data)
    })

    planService.getShoppingList()
    .then((res) => {
      setShoppingList(res.data)
    });
  }, []);

  useEffect(() => {
    setNextMeal(() => {
      const hour = today.getHours();
      if (hour >= 0 && hour < 12) {
        return 'breakfast';
      } else if (hour >= 12 && hour < 18) {
        return 'lunch';
      } else {
        return 'dinner';
      }
    })
    setTodayString(() => {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return days[today.getDay()];
    })
  }, [today]);

  useEffect(() => {
    setNextMealType(() => {
      switch (nextMeal) {
        case 'breakfast':
          return MealTypes.breakfast;
    
        case 'lunch':
          return MealTypes.lunch;
        
        case 'dinner':
          return MealTypes.dinner;

        default:
          return MealTypes.breakfast;
      }
    })
  }, [nextMeal])
  
  return (
    <PlanContext.Provider value={{ plan, today, nextMeal, todayString, nextMealType, shoppingList}}>
      {children}
    </PlanContext.Provider>
  )
}

export {
  usePlan,
  PlanProvider
}