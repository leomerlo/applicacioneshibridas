import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useNotifications } from "../contexts/NotificationsContext"
import GoBack from "./GoBack"
import patientsService from "../services/patients.service"
import type { Patient } from "../services/patients.service"
import LoginImage from '../assets/loginImage.png'
import Button from "./Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faCircleCheck } from "@fortawesome/free-regular-svg-icons"
import { faCarrot, faUserSlash } from "@fortawesome/free-solid-svg-icons"
import PatientNextMeal from "./NextMeals/PlanNextMeal"
import { useProfile } from "../contexts/ProfileContext"
import { usePlan } from "../contexts/PlanContext"
import HeadDivider from "./HeadDivider"
import DaysCarousel from "./DaysCarousel/DaysCarousel"

const Patient = () => {
  const navigate = useNavigate();
  const { todayString } = usePlan();
  const [day, setDay] = useState<string>(todayString);
  const notifications = useNotifications();
  const { patient, setCurrentPatient, refreshPatients } = useProfile();
  const emptyPatient: Patient = {
    _id: '',
    name: '',
    plan: null,
    status: 'inactive',
    accountType: 'user',
    diners: 1
  };

  const [activePatient, setActivePatient] = useState<Patient>(emptyPatient);

  useEffect(() => {
    setDay(todayString);
  }, [todayString]);

  useEffect(() => {
    patientsService.getPatient(patient._id as string).then((resp) => {
      if (resp.status === 200) {
        setActivePatient(resp.data);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al obtener el paciente'
        });
        navigate('/');
      }
    });
  }, [patient._id]);

  const assignPlanHandler = () => {
    navigate(`/patient/${patient._id}/assignPlan`);
  }

  const unAssignPatient = () => {
    patientsService.unassignPatient(patient._id as string).then((resp) => {
      if (resp.status === 201) {
        notifications.updateNotifications({
          variant: 'success',
          message: 'Paciente desvinculado'
        });
        refreshPatients();
        setCurrentPatient('');
        navigate('/patients');
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al desvincular paciente'
        });
      }
    });
    // TODO: Confirmation
  }

  const changeDayHandler = (day: string) => {
    setDay(day);
  }

  const unsetPatient = () => {
    setCurrentPatient('');
    navigate('/patients');
  }

  return (
    <div className="container-fluid mx-auto h-full">
      <div className="flex flex-col h-full pb-20">
        <div>
          <GoBack onClick={unsetPatient} />
        </div>
        <div className="flex-grow">
          { activePatient.plan ? <>
            <HeadDivider>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl mb-4">{activePatient.name}</h1>
                <Button variant="secondary" onClick={unAssignPatient} size="small">
                  Desvincular paciente
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
                  <span className="text-gray-80 font-bold">Plan activo: {activePatient.plan.meta.title}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" full onClick={assignPlanHandler} size="small">
                    Asignar otro plan
                  </Button>
                </div>
              </div>
            </HeadDivider>
            <DaysCarousel day={day} onDayChange={changeDayHandler} />
            <PatientNextMeal plan={activePatient.plan} day={day} />
          </> : <>
            <div className="flex flex-col justify-center w-1/2 items-center mx-auto mt-12">
              <h1 className="text-4xl mt-6">{activePatient.name}</h1>
              <h2 className="text-2xl text-gray-80 mb-4">Este paciente aún no tiene ningún plan asignado</h2>
              <div className="flex gap-3">
                <Button size="small" onClick={assignPlanHandler}>Asignar plan</Button>
                <Button variant="secondary" onClick={unAssignPatient} size="small">
                  Desvincular paciente
                </Button>
              </div>
            </div>
          </> }
        </div>
        {/* <FooterMenu>
          <Button variant="secondary" full>
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Editar perfil
          </Button>
          <Button variant="secondary" full onClick={unAssignPatient}>
            <FontAwesomeIcon icon={faUserSlash} className="me-2" />
            Desasignar paciente
          </Button>
          <Button variant={activePatient.plan ? "secondary" : "primary"} onClick={assignPlanHandler} full>
            <FontAwesomeIcon icon={faCarrot} className="me-2" />
            { activePatient.plan ? 'Modificar plan' : 'Asignar plan'}
          </Button>
        </FooterMenu> */}
      </div>
    </div>
  )
}

export default Patient