import { useState, SyntheticEvent, createRef } from "react"
import { redirect } from "react-router-dom";
import accountService from "../services/account.service"
import planService from "../services/plan.service"
import { useProfile } from "../contexts/ProfileContext"
import { useNotifications } from "../contexts/NotificationsContext"
import { usePlan } from "../contexts/PlanContext"
import Button, { ButtonType } from "../components/Button"
import GoBack from "../components/GoBack"
import Loading from "../components/Loading"
import ProfileImage from "../assets/animalFriends.png"

const Profile = () => {
  const { profile, refreshProfile } = useProfile();
  const { updatePlan } = usePlan();
  const [tempProfile, setTempProfile] = useState(profile);
  const { updateNotifications } = useNotifications();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const formRef = createRef();

  const saveHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoadingButton(true);
    accountService.updateProfile(tempProfile).then((result) => {
      setLoadingButton(false);
      if(result.status !== 201) {
        updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
      } else {
        updateNotifications({ variant: 'success', message: 'Perfil actualizado con éxito' });
        refreshProfile();
      }
    });
  }

  const newPlan = () => {
    setLoadingPlan(true);
    accountService.updateProfile(tempProfile).then((result) => {
      if(result.status !== 201) {
        updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
      } else {
        refreshProfile();
        planService.newPlan().then((response) => {
          setLoadingPlan(false);
          if(response.status === 201) {
            updatePlan();
            redirect("/");
          } else {
            updateNotifications({ variant: 'error', message: 'Error al crear el plan, intentalo de nuevo.' });
          }
        });
      }
    });
  }

  return (
    <div className="container mx-auto">
      { loadingPlan ? <Loading action="Estamos generando tu plan" subtext="Tené paciencia, esto puede tardar unos minutos" /> :
      <>
        <div className="flex justify-between">
          <GoBack />
        </div>
        <div className="mx-auto w-fit">
          <img src={ProfileImage} />
        </div>
        <h1 className="text-4xl mt-6">Mi Perfil</h1>
        <form onSubmit={saveHandler} ref={formRef}>
          <div className="mt-4">
            <label className="text-gray-80 block mb-1" htmlFor="name">Nombre</label>
            <input
              type="text"
              className="input rounded border border-gray-50 p-2 text-sm w-full"
              name="name"
              id="name"
              value={tempProfile.name}
              onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-80 block mb-1" htmlFor="restrictions">Restricciones y alergias</label>
            <textarea
              className="input rounded border border-gray-50 p-2 text-sm w-full"
              name="restrictions"
              id="restrictions"
              value={tempProfile.restrictions}
              placeholder="Gluten-free, vegetariano, alergia al tofu, etc."
              onChange={(e) => setTempProfile({...tempProfile, restrictions: e.target.value})}
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-80 block mb-1" htmlFor="preferences">Preferencias</label>
            <textarea
              className="input rounded border border-gray-50 p-2 text-sm w-full"
              name="preferences"
              id="preferences"
              value={tempProfile.preferences}
              placeholder="Alta en proteinas, fideos los jueves, pizza los sabados, etc."
              onChange={(e) => setTempProfile({...tempProfile, preferences: e.target.value})}
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-80 block mb-1" htmlFor="diners">Comensales</label>
            <input
              type="number"
              className="input rounded border border-gray-50 p-2 text-sm w-full"
              name="diners"
              id="diners"
              value={tempProfile.diners}
              onChange={(e) => setTempProfile({...tempProfile, diners: Number(e.target.value)})}
            />
          </div>
          <hr className="my-8" />
          <div className="mt-4">
            <Button full onClick={newPlan} variant="secondary">Generar plan nuevo</Button>
          </div>
          <hr className="my-8" />
          <div className="mt-4">
            <Button full type={ButtonType.submit} loading={loadingButton}>Guardar</Button>
          </div>
        </form>
      </> }
    </div>
  )
}

export default Profile