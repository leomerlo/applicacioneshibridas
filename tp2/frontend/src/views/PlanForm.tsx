import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import accountService from "../services/account.service"
import planService from "../services/plan.service"
import { useProfile } from "../contexts/ProfileContext"
import { useNotifications } from "../contexts/NotificationsContext"
import { usePlan } from "../contexts/PlanContext"
import Button, { ButtonType } from "../components/Button"
import GoBack from "../components/GoBack"
import Loading from "../components/Loading"
import Input from "../components/Input";

const ProfileForm = () => {
  const { profile, refreshProfile } = useProfile();
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [tempProfile, setTempProfile] = useState(profile);
  const { updateNotifications } = useNotifications();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const form = useRef(null);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  const saveHandler = async () => {
    setLoadingButton(true);
    if(tempProfile.password) {
      accountService.updateAccount({ _id: tempProfile.accountId as string, userName: profile.email, password: tempProfile.password }).then((result) => {
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
    accountService.updateProfile(tempProfile).then((result) => {
      if(result.status !== 201) {
        updateNotifications({ variant: 'error', message: 'Error al actualizar el perfil' });
      } else {
        refreshProfile();
        planService.newPlan().then((response) => {
          setLoadingPlan(false);
          if(response.status === 200) {
            updatePlan().then(() => {
              navigate('/');
            });
          } else {
            updateNotifications({ variant: 'error', message: 'Error al crear el plan, inténtelo de nuevo.' });
          }
        });
      }
    });
  }

  return (
    <div className="container-fluid w-full md:w-mobile mx-auto my-12">
      <div className="px-6 flex flex-col gap-8">
        <div className="w-full">
          { loadingPlan ? <Loading action="Estamos generando su plan" subtext="Tené paciencia, esto puede tardar unos minutos" /> :
          <>
            <div className="w-full flex justify-between">
              <GoBack />
            </div>
            <div className="flex justify-between items-center mt-6">
              <h1 className="text-4xl">Mi Plan</h1>
              <div className="flex gap-4">
                <div className="hidden md:inline-block">
                  <Button size="small" type={ButtonType.submit} loading={loadingButton} variant="primary" onClick={saveHandler}>Guardar</Button>
                </div>
              </div>
            </div>
            <form>
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
                  { profile.accountType === 'user' && !profile.docId ? <>
                    <div className="mt-6 block md:hidden">
                      <Button onClick={newPlan} full variant="primary">Generar nuevo plan</Button>
                    </div>
                  </> : <></> }
                </> : <></> }
              </> : <></> }
            </form>
          </> }
        </div>
      </div>
    </div>
  )
}

export default ProfileForm