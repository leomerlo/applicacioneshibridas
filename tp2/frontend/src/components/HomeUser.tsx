import WelcomeCard from "../components/WelcomeCard"
import NextMeals from "../components/NextMeals/NextMeals"
import { usePlan } from "../contexts/PlanContext";
import StartPlan from "../views/StartPlan";
import { useProfile } from "../contexts/ProfileContext";
import Loading from "../components/Loading";
import EmptyPlanImage from "../assets/girlBowl.png";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import CTACard from "./CTACard";

const HomeUser = () => {
  const { plan, loadedPlan } = usePlan();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const editProfileHandler = () => {
    navigate('/profile');
  }

  const shoppingListHandler = () => {
    navigate('/shoppingList');
  }

  return (
    <div className="container-fluid md:w-mobile mx-auto flex flex-col h-full justify-start mt-12 mb-6">
      {(profile.accountId != '' && loadedPlan) ? <>
        {plan?.meta ? <div className="w-fit flex flex-col gap-8 px-6">
          <WelcomeCard />
          <NextMeals />
          <CTACard
            title="Preparativos para tu semana saludable"
            description="Revisá los ingredientes necesarios y preparate para cumplir tus metas."
            ctaText="Ver lista de compras"
            ctaAction={shoppingListHandler}
          />
        </div>
          :
          profile.docId ? <>
            <div className="w-fit px-6 lg:w-6/12 mx-auto flex flex-col h-full">
              <div className="mx-auto w-3/4 mt-8 -translate-x-8">
                <img src={EmptyPlanImage} className="mx-auto" />
              </div>
              <div className="text-left mt-8">
                <h1 className="text-3xl text-gray-90">¡Hola! Parece que aún no tenés un plan generado.</h1>
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