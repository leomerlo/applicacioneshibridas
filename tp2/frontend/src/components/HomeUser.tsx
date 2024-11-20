import WelcomeCard from "../components/WelcomeCard"
import NextMeals from "../components/NextMeals/NextMeals"
import { usePlan } from "../contexts/PlanContext";
import StartPlan from "../views/StartPlan";
import { useProfile } from "../contexts/ProfileContext";
import Loading from "../components/Loading";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import CTACard from "./CTACard";

const HomeUser = () => {
  const { plan, loadedPlan } = usePlan();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const shoppingListHandler = () => {
    navigate('/shoppingList');
  }

  return (
    (profile.accountId != '' && loadedPlan) ?
      plan?.meta ? <div className="container-fluid w-full md:w-mobile mx-auto flex flex-col h-full justify-start mt-12 mb-6">
        <div className="flex flex-col gap-8 px-6">
          <WelcomeCard />
          <NextMeals plan={plan} />
          <div className="mt-8">
            <CTACard
              title="Preparativos para tu semana saludable"
              description="Revisá los ingredientes necesarios y preparate para cumplir tus metas."
              ctaText="Ver lista de compras"
              ctaAction={shoppingListHandler}
            />
          </div>
          { !profile.doctor && profile.accountType === "user" && (
            <div className="my-4">
              <Button full onClick={() => navigate('/plan')} variant="secondary">Quiero modificar mi plan</Button>
            </div>
          )}
        </div>
      </div>
      :
      <StartPlan isPatient={!!profile.docId}/>
    : <Loading action="Estamos cargando tus datos..." />
  )
}

export default HomeUser