import PlanList from "../components/PlanList";
import GoBack from "../components/GoBack";
import FooterMenu from "../components/FooterMenu";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Plans = () => {
  const navigate = useNavigate(); 
  
  const addPlanHandler = () => {
    navigate('/addPlan');
  }

  const planClickHandler = (planId: string) => {
    navigate(`/plan/${planId}`);
  }

  return (
    <div className="container mx-auto">
      <div className="pb-20">
        <GoBack />
        <h1 className="text-4xl mt-6 mb-2">Mis Planes</h1>
        <PlanList onPlanClick={planClickHandler} />
      </div>
      <FooterMenu>
        <Button onClick={addPlanHandler} full>Agregar plan</Button>
      </FooterMenu>
    </div>
  )
}

export default Plans