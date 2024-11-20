import { useState, useRef } from "react"
import accountService from "../services/account.service"
import { useProfile } from "../contexts/ProfileContext"
import { useNotifications } from "../contexts/NotificationsContext"
import Button, { ButtonType } from "../components/Button"
import GoBack from "../components/GoBack"
import Input from "../components/Input";

const ProfileForm = () => {
  const { profile, refreshProfile } = useProfile();
  const [tempProfile, setTempProfile] = useState(profile);
  const { updateNotifications } = useNotifications();
  const [loadingButton, setLoadingButton] = useState(false);

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

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <GoBack />
      </div>
      <form>
        <div className="flex justify-between items-center mt-6">
          <h1 className="text-4xl">Mi perfil</h1>
          <div className="flex gap-4">
            <div className="hidden md:inline-block">
              <Button size="small" type={ButtonType.submit} loading={loadingButton} variant="primary" onClick={saveHandler}>Guardar</Button>
            </div>
          </div>
        </div>
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
        { profile.accountType !== 'user' && (<>
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
        )}
        <div className="mt-6 block md:hidden">
          <Button full type={ButtonType.submit} loading={loadingButton} variant="primary" onClick={saveHandler}>Guardar</Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm