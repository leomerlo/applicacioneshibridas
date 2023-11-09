import WelcomeCard, { WelcomeType } from "../components/WelcomeCard"
import FeaturedMealCard from "../components/FeaturedMealCard"
import NextMeals from "../components/NextMeals/NextMeals"
import { usePlan } from "../contexts/PlanContext";
import StartPlan from "../views/StartPlan";
import { useProfile } from "../contexts/ProfileContext";
import Loading from "../components/Loading";
import EmptyPlanImage from "../assets/girlBowl.png";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const HomeUser = () => {
  const { plan, loadedPlan } = usePlan();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const editProfileHandler = () => {
    navigate('/profile');
  }

  return (
    <div className="container mx-auto flex flex-col h-full justify-start">
      {(profile.accountId != '' && loadedPlan) ? <>
        {plan ? <div>
          <WelcomeCard mode={WelcomeType.h} />
          <FeaturedMealCard />
          <NextMeals />
        </div>
          :
          profile.docId ? <>
            <div className="w-fit lg:w-6/12 mx-auto flex flex-col h-full">
              <div className="mx-auto w-3/4 mt-8 -translate-x-8">
                <img src={EmptyPlanImage} className="mx-auto" />
              </div>
              <div className="text-left mt-8">
                <h1 className="text-3xl text-gray-90">¡Hola! Parece que no tenés un plan generado.</h1>
                <p className="text-gray-80 mt-8">
                  Comunicate con tu nutricionista para que te genere un plan.
                </p>
                <p className="text-gray-80 mt-4">
                  Mientras tanto, podés empezar agregando tu nombre en el perfil.
                </p>
              </div>
              <div className="mt-8 flex grow items-end">
                <div className="w-full">
                  <Button full onClick={editProfileHandler}>Editar perfil</Button>
                </div>
              </div>
            </div>
          </> : <StartPlan />
        }
      </> : <Loading action="Estamos cargando tus datos..." />}
    </div>
  )
}

export default HomeUser