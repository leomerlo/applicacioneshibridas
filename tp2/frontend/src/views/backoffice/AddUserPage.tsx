import AddUser from "../../components/AddUser"
import { useNotifications } from "../../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";
import backofficeService from "../../services/backoffice.service"
import { useAdmin } from "../../contexts/AdminContext";


const AddUserPage = () => {
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { updateUsers } = useAdmin();
  
  async function createAccountService(user: any) {
    const resp = await backofficeService.createAccount(user);
    if (resp.status === 201) {
      notifications.updateNotifications({
        variant: 'success',
        message: 'Usuario creado con éxito'
      });
      await updateUsers();
      navigate(-1);
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: 'Hubo un problema al crear al usuario'
      });
    }
  }

  return (
    <AddUser addService={createAccountService}/>
  )
}

export default AddUserPage