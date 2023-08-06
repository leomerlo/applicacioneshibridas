import WelcomeCard, { WelcomeType } from "../components/WelcomeCard"
import FeaturedMealCard from "../components/FeaturedMealCard"
import NextMeals from "../components/NextMeals/NextMeals"
import { usePlan } from "../contexts/PlanContext";
import StartPlan from "../views/StartPlan";
import { useProfile } from "../contexts/ProfileContext";
import Loading from "../components/Loading";

const HomeUser = () => {
  const { plan, loadedPlan } = usePlan();
  const { profile } = useProfile();

  return (
    <div className="container mx-auto flex flex-col h-full justify-start">
      { (profile.accountId != '' && loadedPlan ) ? <>
        { plan ? <div>
          <WelcomeCard mode={WelcomeType.h} />
            <FeaturedMealCard />
            <NextMeals />
        </div>
        :
        <StartPlan />
        }
      </> : <Loading action="Estamos cargando tus datos..." /> }
    </div>
  )
}

export default HomeUser