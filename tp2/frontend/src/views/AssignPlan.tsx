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
import { useProfile } from "../contexts/ProfileContext";
import NutriLayout from "../components/NutriLayout";
import PatientList from "../components/PatientList";

const AssignPlan = () => {
  const { id } = useParams<{ id: string }>();
  const { plans } = useProfile(); 
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
          message: 'Hubo un error al obtener el paciente'
        });
      }
    });
  }, []);

  const createPlanHandler = () => {
    navigate(`/addPlan`);
  }

  const patientClickHandler = (id: string) => {
    navigate(`/patient/${id}`);
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
          message: 'Hubo un error al asignar el plan'
        });
      }
    });
  }

  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <PatientList onClick={patientClickHandler}/>
          </div>
        </div>
      }
      content={
        <>
          <GoBack />
          <div className="flex flex-col">
            <h1 className="text-4xl mt-6 mb-2">Asignar Planes</h1>
            <PlanList plans={plans.filter((plan) => plan.meta.status != 'draft')} onClick={(planId: string) => { planClickHandler(planId) }} patientName={patient?.name} />
            <div className="flex justify-end items-center mt-8">
              <span className="me-4">O podés también</span> <Button onClick={createPlanHandler}>Crear un nuevo plan</Button>
            </div>
          </div>
        </>
      }
    />
  )
}

export default AssignPlan