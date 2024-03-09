import { useEffect } from "react"
import PatientNextMeal from "../components/NextMeals/PlanNextMeal"
import planService from "../services/plan.service"
import { useState } from "react"
import { Plan, usePlan } from "../contexts/PlanContext"
import { useNotifications } from "../contexts/NotificationsContext"
import { useNavigate, useParams } from "react-router-dom"
import GoBack from "../components/GoBack"
import FooterMenu from "../components/FooterMenu"
import Button from "../components/Button"
import { useProfile } from "../contexts/ProfileContext";
import DaysCarousel from "../components/DaysCarousel/DaysCarousel"

const PlanView = () => {
  const { id } = useParams();
  const { plan, todayString, planSelectedDay, setPlanSelectedDay } = usePlan();
  const [planData, setPlanData] = useState<Plan>();
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { refreshPlans } = useProfile();

  useEffect(() => {
    if(!planSelectedDay){
      setPlanSelectedDay(todayString);
    }
  }, [todayString]);

  useEffect(() => {
    if(id) {
      planService.getPlanById(id as string).then((resp) => {
        if(resp.status === 200) {
          setPlanData(resp.data);
        } else {
          notifications.updateNotifications({
            variant: 'error',
            message: 'Hubo un error al obtener el plan'
          });
        }
      });
    } else {
      setPlanData(plan as Plan);
    }
  }, []);

  useEffect(() => {
    setPlanData(plan as Plan);
  }, [plan])

  const changeDayHandler = (day: string) => {
    setPlanSelectedDay(day);
  }

  const deletePlanHandler = () => {
    planService.deletePlan(id as string).then((resp) => {
      if(resp.status === 202) {
        notifications.updateNotifications({
          variant: 'success',
          message: 'Plan eliminado con éxito'
        });
        refreshPlans();
        navigate(-1);
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
        { planData ? <>
          <h1 className="text-4xl mt-6 mb-2">{
            id ? planData.title : "Mi plan"}</h1>
          <DaysCarousel day={planSelectedDay} onDayChange={changeDayHandler} />
          <PatientNextMeal day={planSelectedDay} plan={planData as Plan} />
        </>: null }
      </div>
      { id ? 
        <FooterMenu>
          <Button onClick={deletePlanHandler} full>Eliminar plan</Button>
        </FooterMenu>
        :
        null
      }
    </div>
  )
}

export default PlanView