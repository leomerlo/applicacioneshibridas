import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import planService from "../services/plan.service"

export type Meals = {
  breakfast: string;
  lunch: string;
  dinner: string;
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
  shoppingList?: {
    [key: string]: string | number
  }[]
}

const emptyPlan: Plan = {
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
}

const PlanContext = createContext(emptyPlan)

function usePlan(){
  return useContext(PlanContext)
}

function PlanProvider({children}: PropsWithChildren){
  const [plan, setPlan] = useState<Plan>(emptyPlan)

  useEffect(() => {
    planService.getPlan()
    .then((plan) => {
      setPlan(plan.data)
    })
  }, [])
  
  return (
    <PlanContext.Provider value={plan}>
      {children}
    </PlanContext.Provider>
  )
}

export {
  usePlan,
  PlanProvider
}