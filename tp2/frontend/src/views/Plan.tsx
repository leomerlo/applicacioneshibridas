import { useEffect } from "react"
import PatientNextMeal from "../components/NextMeals/PatientNextMeal"
import planService from "../services/plan.service"
import { useState } from "react"
import { Plan } from "../contexts/PlanContext"
import { useNotifications } from "../contexts/NotificationsContext"
import { useNavigate, useParams } from "react-router-dom"
import GoBack from "../components/GoBack"
import FooterMenu from "../components/FooterMenu"
import Button from "../components/Button"
import { useProfile } from "../contexts/ProfileContext"

const PlanView = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState<Plan>();
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { refreshPlans } = useProfile();

  useEffect(() => {
    planService.getPlanById(planId as string).then((resp) => {
      if(resp.status === 200) {
        setPlan(resp.data);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al obtener el plan'
        });
      }
    });
  }, []);

  const deletePlanHandler = () => {
    planService.deletePlan(planId as string).then((resp) => {
      if(resp.status === 204) {
        notifications.updateNotifications({
          variant: 'success',
          message: 'Plan eliminado con éxito'
        });
        refreshPlans();
        navigate('/plans');
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: resp.data.error.message
        });
      }
    });
  }

  return (
    <div className="container mx-auto">
      <div className="pb-20">
        <GoBack />
        { plan ? <>
          <h1 className="text-4xl mt-6 mb-2">{plan.title}</h1>
          <PatientNextMeal  plan={plan as Plan} />
        </>: null }
      </div>
      <FooterMenu>
        <Button onClick={deletePlanHandler} full>Eliminar plan</Button>
      </FooterMenu>
    </div>
  )
}

export default PlanView