import WelcomeCard, { WelcomeType } from "../components/WelcomeCard"
import DaysCarousel from "../components/DaysCarousel/DaysCarousel"
import FeaturedMealCard from "../components/FeaturedMealCard"
import NextMeals from "../components/NextMeals/NextMeals"
import EmptyPlanImage from "../assets/girlBowl.png";
import Button from "../components/Button";
import { PlanProvider } from "../contexts/PlanContext";

const Home = () => {
  const hasPlan = true;

  const newPlan = () => {
  }

  return (
    <div className="container mx-auto flex flex-col h-full justify-center">
      { hasPlan ? <div>
        <WelcomeCard mode={WelcomeType.h} />
        <PlanProvider>
          <DaysCarousel />
          <FeaturedMealCard />
          <NextMeals />
        </PlanProvider>
      </div>
      :
      <div className="w-fit mx-auto flex flex-col h-full">
        <WelcomeCard mode={WelcomeType.v} />
        <div className="mx-auto w-fit mt-8">
          <img src={EmptyPlanImage} className="mx-2" />
        </div>
        <div className="text-center mt-8">
          <h1 className="text-3xl text-gray-90">¡Ups! Parece que aquí no hay nada por el momento.</h1>
          <p className="text-gray-80 mt-8">Gåenerá tu plan y descubrí una experiencia gastronómica única.</p>
        </div>
        <div className="mt-8 mb-8 flex grow items-end">
          <div className="w-full">
            <Button full onClick={newPlan}>Crear plan</Button>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default Home