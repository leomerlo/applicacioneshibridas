import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useNotifications } from "../contexts/NotificationsContext"
import GoBack from "../components/GoBack"
import patientsService from "../services/patients.service"
import type { Patient } from "../services/patients.service"
import LoginImage from '../assets/loginImage.png'
import Button from "../components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faCircleCheck } from "@fortawesome/free-regular-svg-icons"
import { faCarrot } from "@fortawesome/free-solid-svg-icons"
import PatientNextMeal from "../components/NextMeals/PlanNextMeal"
import { useProfile } from "../contexts/ProfileContext"
import FooterMenu from "../components/FooterMenu"
import HeadDivider from "../components/HeadDivider"

const Patient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { setCurrentPatient, patients } = useProfile();
  const [activePatient, setActivePatient] = useState<Patient>({
    _id: '',
    name: '',
    plan: null,
    status: 'inactive',
    accountType: 'user',
    diners: 1
  });

  if (!id) {
    navigate('/');
  }

  useEffect(() => {
    patientsService.getPatient(id as string).then((resp) => {
      if (resp.status === 200) {
        setCurrentPatient(id as string);
        setActivePatient(resp.data);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al obtener el paciente'
        });
        navigate('/');
      }
    });
  }, [patients]);

  const assignPlanHandler = () => {
    navigate(`/patient/${id}/assignPlan`);
  }

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full pb-20">
        <div>
          <GoBack />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl mt-6">{activePatient.name}</h1>
          { activePatient.plan ? <>
            <HeadDivider>
              <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
              <span className="text-gray-80 font-bold">Plan activo: {activePatient.plan.title}</span>
            </HeadDivider>
            <PatientNextMeal plan={activePatient.plan} />
          </> : <>
            <img src={LoginImage} aria-hidden="true" className="w-1/2 mx-auto my-8" />
            <h2 className="text-2xl text-gray-80 text-center font-bold">Este paciente todavía no tiene ningún plan asignado</h2>
          </> }
        </div>
        <FooterMenu>
          <Button variant="secondary" full>
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Editar Perfil
          </Button>
          <Button variant={activePatient.plan ? "secondary" : "primary"} onClick={assignPlanHandler} full>
            <FontAwesomeIcon icon={faCarrot} className="me-2" />
            { activePatient.plan ? 'Cambiar Plan' : 'Asignar Plan'}
          </Button>
        </FooterMenu>
      </div>
    </div>
  )
}

export default Patient