import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import PlanList from "../components/PlanList";
import GoBack from "../components/GoBack";
import { useEffect } from "react";
import * as patientsService from "../services/patients.service";
import { useNotifications } from "../contexts/NotificationsContext";
import type { Patient } from "../services/patients.service";
import FooterMenu from "../components/FooterMenu";
import Button from "../components/Button";

const AssignPlan = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient>();
  const notifications = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    patientsService.getPatient(id as string).then((resp) => {
      if(resp.status === 200) {
        setPatient(resp.data);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al obtener el paciente'
        });
      }
    });
  }, []);

  const createPlanHandler = () => {
    navigate(`/addPlan`);
  }

  const planClickHandler = (planId: string) => {
    const planAssignment = {
      patientId: id as string,
      planId
    };
    setLoading(true);
    patientsService.assignPlan(planAssignment).then((resp) => {
      setLoading(false);
      if(resp.status === 201) {
        notifications.updateNotifications({
          variant: 'success',
          message: 'Plan asignado con éxito'
        });
        navigate(`/patient/${id}`);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al asignar el plan'
        });
      }
    });
  }

  return (
    <div className="container mx-auto">
      <GoBack />
      <h1 className="text-4xl mt-6 mb-2">Asignar Planes</h1>
      <PlanList onPlanClick={(planId: string) => { planClickHandler(planId) }} patientName={patient?.name} />
      <FooterMenu>
        <Button full onClick={createPlanHandler}>Crear Plan</Button>
      </FooterMenu>
    </div>
  )
}

export default AssignPlan