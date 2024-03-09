import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import { useNotifications } from "../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import planService from "../services/plan.service";
import Loading from "../components/Loading";

const AddPlan = () => {
  const [title, setTitle] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();

  const titleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const restrictionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestrictions(event.target.value);
  };

  const preferencesHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(event.target.value);
  }

  const createPlan = () => {
    setLoading(true);
    planService.newDocPlan({
      title,
      preferences,
      restrictions,
    }).then((resp) => {
      setLoading(true);
      if(resp.status === 201){
        notifications.updateNotifications({
          variant: 'success',
          message: 'Plan creado con éxito'
        });
        refreshProfile();
        navigate(-1);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Hubo un problema al crear el plan'
        });
      }
    });
  };

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full">
        { loading ? <Loading action="Estamos creando tu plan." /> : <>
          <div className="text-left">
            <GoBack />
          </div>
          <div className="flex-grow">
            <h1 className="text-4xl text-gray-80 mt-5">Agregar Plan</h1>
            <div className="mt-8">
              <Input name="title" type="text" label="Titulo" value={title} onInput={titleHandler} placeholder="Un titulo para el plan" />
            </div>
            <div className="mt-8">
              <Input
                name="restrictions"
                type="textarea"
                label="Restricciones"
                value={restrictions}
                onInput={restrictionHandler}
                placeholder="Sin gluten, vegetariano, alergia al tofu, etc." />
            </div>
            <div className="mt-8">
              <Input
                name="preferences"
                type="textarea"
                label="Preferencias"
                value={preferences}
                onInput={preferencesHandler}
                placeholder="Rico en proteínas, fideos los jueves, pizza los sabados, etc." />
            </div>
          </div>
          <div>
            <Button full loading={loading} onClick={createPlan}>Crear Plan</Button>
          </div>
        </>}
      </div>
    </div>
  )
}

export default AddPlan