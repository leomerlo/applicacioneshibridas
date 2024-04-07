import { useState, SyntheticEvent, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import accountService from "../services/account.service"
import planService from "../services/plan.service"
import { useProfile } from "../contexts/ProfileContext"
import { useNotifications } from "../contexts/NotificationsContext"
import { usePlan } from "../contexts/PlanContext"
import Button, { ButtonType } from "../components/Button"
import GoBack from "../components/GoBack"
import Loading from "../components/Loading"
import ProfileImage from "../assets/animalFriends.png"
import Input from "../components/Input";

const Profile = () => {
  const { profile, refreshProfile } = useProfile();
  const navigate = useNavigate();
  const { updatePlan } = usePlan();
  const [tempProfile, setTempProfile] = useState(profile);
  const { updateNotifications } = useNotifications();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  const saveHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoadingButton(true);
    if(tempProfile.password) {
      accountService.updateAccount({ _id: tempProfile.accountId as string, userName: profile.email as string, password: tempProfile.password }).then((result) => {
        if(result.status !== 201) {
          updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
          return false;
        } else {
          updateNotifications({ variant: 'success', message: 'Perfil actualizado con éxito' });
        }
      });
    }
    accountService.updateProfile(tempProfile).then((result) => {
      setLoadingButton(false);
      tempProfile.password = '';
      if(result.status !== 201) {
        updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
      } else {
        updateNotifications({ variant: 'success', message: 'Perfil actualizado con éxito' });
        refreshProfile();
      }
    });
  }

  const newPlan = async () => {
    setLoadingPlan(true);
    const result = accountService.updateProfile(tempProfile);
    // @ts-ignore
    if(result.status !== 201) {
      updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
    } else {
      refreshProfile();
      const response = await planService.newPlan();
      planService.newPlan();
      setLoadingPlan(false);
      if(response.status === 201) {
        updatePlan();
        navigate("/");
      } else {
        updateNotifications({ variant: 'error', message: 'Error al crear el plan, inténtelo de nuevo.' });
      }
    };
  }

  return (
    <div className="container mx-auto">
      { loadingPlan ? <Loading action="Estamos generando su plan" subtext="Tené paciencia, esto puede tardar unos minutos" /> :
      <>
        <div className="flex justify-between">
          <GoBack />
        </div>
        <h1 className="text-4xl mt-6">Mi perfil</h1>
        <form onSubmit={saveHandler}>
          <div className="mt-4">
            <Input
              name="name"
              label="Nombre"
              value={tempProfile.name}
              onInput={(e) => setTempProfile({...tempProfile, name: e.target.value})}
              type="text"
            />
          </div>
          <div className="mt-4">
            <Input
              name="password"
              label="Contraseña"
              value={tempProfile.password as string}
              onInput={(e) => setTempProfile({...tempProfile, password: e.target.value})}
              type="password"
            />
          </div>
          { profile.accountType === 'user' ? <>
            { !profile.docId ? <>
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
                <label className="text-gray-80 block mb-1" htmlFor="preferences">Metas</label>
                <textarea
                  className="input rounded border border-gray-50 p-2 text-sm w-full"
                  name="preferences"
                  id="preferences"
                  value={tempProfile.preferences}
                  placeholder="2300 calorías diarias, alta en proteinas, fideos los jueves, pizza los sabados, etc."
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
            </> : <></>}
          </> : <>
            <div className="mt-4">
              <Input
                name="idDocument"
                label="Documento"
                value={tempProfile.idDocument as string}
                onInput={(e) => setTempProfile({...tempProfile, idDocument: e.target.value})}
                placeholder="Dni, sin puntos ni espacios"
                disabled
                type="text"
              />
            </div>
            <div className="mt-4">
              <Input
                name="idLicense"
                label="Matricula"
                value={tempProfile.idLicense as string}
                onInput={(e) => setTempProfile({...tempProfile, idLicense: e.target.value})}
                placeholder="Matricula, sin puntos ni espacios"
                disabled
                type="text"
              />
            </div>
          </>
          }
          <hr className="my-8" />
          <div className="mt-4">
            <Button full type={ButtonType.submit} loading={loadingButton}>Guardar</Button>
          </div>
          { profile.accountType === 'user' && !profile.docId ? <>
            <div className="mt-4">
              <Button full onClick={newPlan} variant="secondary">Generar nuevo plan</Button>
            </div>
          </> : <></>}
        </form>
        <div className="mx-auto w-fit my-4">
          <img src={ProfileImage} />
        </div>
      </> }
    </div>
  )
}

export default Profile