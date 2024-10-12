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

  const [selectedPlan, SetSelectedPlan] = useState<string | null>(null);
  
  const addPlanHandler = () => {
    navigate('/addPlan');
  }

  const planClickHandler = (planId: string) => {
    navigate(`/plan/${planId}/assistant`);
  }

  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <h2 className="text-xl mb-5">Mis planes</h2>
            <PlanList plans={plans} onClick={planClickHandler} />
          </div>
          <div>
            <Button onClick={addPlanHandler} full>Crear plan</Button>
          </div>
        </div>
      }
      content={
        <>
          { plans.length > 0 ? <>
              <div className="w-1/2 mx-auto mt-4 text-center">
                <h1 className="text-2xl">Seleccioná un plan para comenzar.</h1>
              </div>
            </> : <>
              <div className="flex flex-col justify-center w-1/2 items-center mx-auto mt-12">
              <h1 className="py-3 text-xl">No tenés planes creados.</h1>
                <Button onClick={() => {navigate('/addPlan')}}>Creá tu primer plan</Button>
              </div>
            </>
          }
        </>
      }
    />
  )
}

export default Plans