import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import planService from "../services/plan.service"
import { MealTypes } from "../components/NextMeals/NextMealItem";
import { useNotifications } from "./NotificationsContext";

export type Meals = {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface ShoppingListIngredient {
  name: string,
  quantity: number,
  unit: string
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
  shoppingList?: ShoppingListIngredient[]
}

const emptyPlan: {
  plan: Plan | null,
  updatePlan: () => void,
  today: Date,
  nextMeal: string,
  todayString: string,
  nextMealType: MealTypes,
  shoppingList?: ShoppingListIngredient[],
  loadedPlan: boolean
} = {
  plan: null,
  updatePlan: () => {},
  today: new Date(),
  nextMeal: '',
  todayString: '',
  nextMealType: MealTypes.breakfast,
  loadedPlan: false
}

const PlanContext = createContext(emptyPlan)

function usePlan(){
  return useContext(PlanContext)
}

function PlanProvider({children}: PropsWithChildren){
  const [plan, setPlan] = useState<Plan | null>(emptyPlan.plan);
  const [loadedPlan, setLoadedPlan] = useState(emptyPlan.loadedPlan);
  const [today, setToday] = useState<Date>(emptyPlan.today);
  const [todayString, setTodayString] = useState<string>('');
  const [nextMeal, setNextMeal] = useState<string>(emptyPlan.nextMeal);
  const [nextMealType, setNextMealType] = useState<MealTypes>(emptyPlan.nextMealType);
  const { updateNotifications } = useNotifications();

  useEffect(() => {
    setToday(new Date());

    planService.getPlan()
    .then((plan) => {
      setLoadedPlan(true);
      if(plan.data) {
        setPlan(plan.data)
      }
    })
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

  const updatePlan = async () => {
    planService.getPlan().then((plan) => {
      updateNotifications({ variant: 'success', message: 'Plan creado con éxito' });
      setPlan({...plan.data});
    })
  };
  
  return (
    <PlanContext.Provider value={{ plan, updatePlan, today, nextMeal, todayString, nextMealType, loadedPlan }}>
      {children}
    </PlanContext.Provider>
  )
}

export {
  usePlan,
  PlanProvider
}