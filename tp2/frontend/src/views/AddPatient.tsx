import AddUser from "../components/AddUser";
import * as patientsService from "../services/patients.service";
import { useNotifications } from "../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

const AddPatient = () => {
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();
  
  async function addPatientService(user: any) {
    const resp = await patientsService.addPatient(user)
    if (resp.status === 201) {
      refreshProfile();
      notifications.updateNotifications({
        variant: 'success',
        message: 'Paciente creado correctamente'
      });
      navigate(-1);
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: 'Hubo un problema al crear al paciente'
      });
    }
  }

  return (
    <AddUser type="user" addService={addPatientService} />
  )
}

export default AddPatient