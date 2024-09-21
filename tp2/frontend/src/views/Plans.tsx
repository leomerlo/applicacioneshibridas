import { useProfile } from "../contexts/ProfileContext";
import PlanList from "../components/PlanList";
import GoBack from "../components/GoBack";
import FooterMenu from "../components/FooterMenu";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import NutriLayout from "../components/NutriLayout";
import { useState } from "react";

const Plans = () => {
  const { plans } = useProfile();
  const navigate = useNavigate(); 

  const [selectedPlan, SetselectedPlan] = useState<string | null>(null);
  
  const addPlanHandler = () => {
    navigate('/addPlan');
  }

  const planClickHandler = (planId: string) => {
    navigate(`/plan/${planId}`);
  }

  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <PlanList plans={plans} onPlanClick={planClickHandler} />
          </div>
          <div>
            <Button onClick={addPlanHandler} full>Crear plan</Button>
          </div>
        </div>
      }
      content={
        <>
          { plans.length > 0 ? <>
              { !selectedPlan ? <>
                <h1 className="text-2xl">Seleccioná un paciente para ver su información</h1>
              </> : <>
                <Plan id={selectedPlan} />
              </>}
            </> : <>
              <h1 className="py-3 text-xl">No tenés planes creados.</h1>
              <h2 className="py-3 text-lg"><Link className="underline" to={'/addPlan'}>Creá tu primer plan</Link></h2>
            </>
          }
        </>
      }
    />
  )
}

export default Plans