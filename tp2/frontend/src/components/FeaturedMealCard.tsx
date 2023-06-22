import { useEffect, useState } from "react";
import cardGradient from "../assets/cardGradient.svg"
import { usePlan } from "../contexts/PlanContext"
import { MealTypes } from "./NextMeals/NextMealItem";
import { Link } from "react-router-dom";

const FeaturedMealCard = () => {
  const {plan, todayString, nextMeal, nextMealType} = usePlan();  

  const [featuredMeal, setFeaturedMeal] = useState<{
    name: string,
    meal: MealTypes
  }>({
    name: '',
    meal: MealTypes.breakfast
  });

  useEffect(() => {
    if (todayString !== '') {
      setFeaturedMeal({
        name: plan.meals[todayString][nextMeal],
        meal: nextMealType
      })
    }
  }, [plan])

  return (
    <Link to={`/recipie/${featuredMeal.name}`}>
      <div
        style={{'--image-url': `url(${cardGradient})`}}
        className="flex flex-col p-10 bg-[image:var(--image-url)] bg-cover rounded-lg mt-6"
      >
        <h2 className="text-xl text-white">{featuredMeal.name}</h2>
        <span className="text-gray-40">{featuredMeal.meal}</span>
        {/* <ul className="text-sm text-gray-10 mt-4">
          <li><span className="font-bold">Calorias:</span> 560</li>
          <li><span className="font-bold">Calorias:</span> 560</li>
          <li><span className="font-bold">Calorias:</span> 560</li>
        </ul>
        <div className="flex mt-6">
          <span className="inline-block bg-info-secondary text-info-main text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2">Champignones</span> <span className="inline-block bg-info-secondary text-info-main text-xs px-2 rounded-full uppercase font-semibold tracking-wide">Espinacas</span>
        </div> */}
      </div>
    </Link>
  )
}

export default FeaturedMealCard