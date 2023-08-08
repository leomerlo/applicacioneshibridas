import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import * as patientsService from "../services/patients.service";
import generator from "generate-password-browser";
import { useNotifications } from "../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

const AddPatient = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const createPatient = () => {
    setLoading(true);
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    patientsService.addPatient({
      userName,
      password,
      type: "user",
    })
    .then((resp) => {
      setLoading(false);
      if (resp.status === 201) {
        refreshProfile();
        notifications.updateNotifications({
          variant: 'success',
          message: 'Paciente creado con éxito'
        });
        navigate(-1);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Hubo un problema al crear al paciente'
        });
      }
    });
  };

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full">
        <div className="text-left">
          <GoBack />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl text-gray-80 mt-5">Agregar Paciente</h1>
          <div className="mt-8">
            <Input name="userName" type="email" label="Email" value={userName} onInput={userNameHandler} placeholder="Escribi tu email" />
          </div>
        </div>
        <div>
          <Button full loading={loading} onClick={createPatient}>Crear Paciente</Button>
        </div>
      </div>
    </div>
  )
}

export default AddPatient