import WelcomeCard, { WelcomeType } from "../components/WelcomeCard"
import FeaturedMealCard from "../components/FeaturedMealCard"
import NextMeals from "../components/NextMeals/NextMeals"
import { usePlan } from "../contexts/PlanContext";
import StartPlan from "./StartPlan";

const Home = () => {
  const { plan } = usePlan();

  return (
    <div className="container mx-auto flex flex-col h-full justify-start">
      { plan ? <div>
        <WelcomeCard mode={WelcomeType.h} />
          <FeaturedMealCard />
          <NextMeals />
      </div>
      :
      <StartPlan />
      }
    </div>
  )
}

export default Home