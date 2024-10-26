import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import { useNotifications } from "../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import planService from "../services/plan.service";
import Loading from "../components/Loading";
import NutriLayout from "../components/NutriLayout";
import PlanList from "../components/PlanList";
import Schema, { Rules, ValidateError } from "async-validator";

const AddPlan = () => {
  const [title, setTitle] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [preferences, setPreferences] = useState("");
  const [formErrors, setFormErrors] = useState({
    title: [],
    restrictions: [],
    preferences: []
  });
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();
  const definition: Rules = {
    title: {
      type: "string",
      required: true,
      message: "El título es requerido",
    },
    restrictions: {
      type: "string",
      required: true,
      message: "Las restricciones son requeridas",
    },
    preferences: {
      type: "string",
      required: false,
    }
  };
  const validator = new Schema(definition);

  const titleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const restrictionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestrictions(event.target.value);
  };

  const preferencesHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(event.target.value);
  }

  const createPlan = async () => {
    await validator.validate({ title, restrictions, preferences }, (errors) => {
      if (errors) {
        const errorList = formErrors;
        errors.forEach((e: ValidateError) => {
          errorList[e.field as string] = [e.message];
        });
        setFormErrors({
          ...formErrors,
          ...errorList
        });
      } else {
        setFormErrors({
          title: [],
          restrictions: [],
          preferences: []
        });
      }
    });
    setLoading(true);
    const resp = await planService.newPlanAssistant({
      title,
      preferences,
      restrictions,
    });
    setLoading(false);
    if(resp.status === 200){
      await refreshProfile();
      const planId = resp.data.planId;
      navigate(`/plan/${planId}/assistant`);
    } else {
      notifications.updateNotifications({
        variant: 'error',
        message: resp.data.error.message
      });
    }
  };

  const planClickHandler = (assistantURI: string) => {
    navigate(`/plan/${assistantURI}`);
  }

  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <PlanList onClick={planClickHandler} />
          </div>
        </div>
      }
      content={
        <div className="container-fluid mx-auto h-full">
          <div className="flex flex-col h-full">
            { loading ? <Loading action="Estamos creando tu plan." /> : <>
              <div className="text-left">
                <GoBack />
              </div>
              <div className="flex-grow">
                <h1 className="text-2xl text-gray-80 mt-5">Nuevo Plan</h1>
                <div className="mt-8">
                  <Input name="title" required type="text" label="Titulo" value={title} onInput={titleHandler} placeholder="Un titulo para el plan" error={formErrors.title} />
                </div>
                <div className="mt-8">
                  <Input
                    name="restrictions"
                    type="textarea"
                    required
                    error={formErrors.restrictions}
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
                    error={formErrors.preferences}
                    onInput={preferencesHandler}
                    placeholder="Rico en proteínas, fideos los jueves, pizza los sabados, etc." />
                </div>
              </div>
              <div className="mt-4">
                <Button full loading={loading} onClick={createPlan}>Nuevo Plan</Button>
              </div>
            </>}
          </div>
        </div>
      }
    />
  )
}

export default AddPlan