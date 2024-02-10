import { useEffect, useState } from "react";
import backofficeService from "../../services/backoffice.service";
import { useNotifications } from "../../contexts/NotificationsContext";
import type { Profile } from "../../contexts/ProfileContext";
import GoBack from "../../components/GoBack";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import FooterMenu from "../../components/FooterMenu";
import Input from "../../components/Input";
import { useParams } from "react-router-dom";

const UserView = () => {
  const { id } = useParams();
  const notifications = useNotifications();
  const [userProfile, setUserProfile] = useState({} as Profile);
  const [tempProfile, setTempProfile] = useState({} as Profile);

  useEffect(() => {
      backofficeService.getAccount(id as string).then((resp) => {
      if(resp.status === 200) {
        setUserProfile(resp.data);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al obtener el plan'
        });
      }
    });
  }, []);

  useEffect(() => {
    setTempProfile(userProfile);
  }, [userProfile])

  const saveHandler = () => {
    backofficeService.updateAccount(tempProfile._id as string, tempProfile).then((resp) => {
      if(resp.status === 200) {
        notifications.updateNotifications({
          variant: 'success',
          message: 'Usuario actualizado correctamente'
        });
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al actualizar el usuario'
        });
      }
    });
  };

  const deleteHandler = () => {
    backofficeService.updateAccount(tempProfile._id as string, { ...tempProfile, status: 'inactive' }).then((resp) => {
      if(resp.status === 200) {
        tempProfile.status = 'inactive';
        notifications.updateNotifications({
          variant: 'success',
          message: 'Usuario desactivado correctamente'
        });
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al desactivar el usuario'
        });
      }
    });
  }

  const activateHandler = () => {
    backofficeService.updateAccount(tempProfile._id as string, { ...tempProfile, status: 'active' }).then((resp) => {
      if(resp.status === 200) {
        tempProfile.status = 'active';
        notifications.updateNotifications({
          variant: 'success',
          message: 'Usuario activado correctamente'
        });
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al activar el usuario'
        });
      }
    });
  }

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full pb-20">
        <div>
          <GoBack />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl mt-6">{tempProfile.email} <span className="text-gray-60 text-lg">id: { tempProfile.accountId }</span></h1>
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
            <div className="flex">
              <div className="mt-4 flex-1">
                <label htmlFor="accountType">Tipo de cuenta</label>
                <select name="accountType" id="accountType" value={tempProfile.accountType} onChange={(e) => setTempProfile({...tempProfile, accountType: e.target.value})} className="my-4 p-2 block w-max">
                  <option value="user">Usuario</option>
                  <option value="doc">Nutricionista</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="mt-4 flex-1">
                <label htmlFor="status">Estado:</label>
                <select name="status" id="status" value={tempProfile.status} onChange={(e) => setTempProfile({...tempProfile, status: e.target.value})} className="my-4 p-2 block w-max">
                  <option value="active">Activo</option>
                  <option value="pending">Pendiente</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            { tempProfile.accountType === 'admin' ? <></> : <>
              { tempProfile.accountType === 'user' ? <>
              { !tempProfile.docId ? <>
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
              </> : <>
                <div className="bg-white rounded-lg shadow-lg p-5 mb-2 flex justify-between">
                  <span className={`primary me-4`}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                  <span className="flex-grow">Este usuario está siendo administrado por un nutricionista. Solo este puede modificar su dieta.</span>
                </div>
              </>}
              </> : <>
                <div className="mt-4">
                  <Input
                    name="idDocument"
                    label="Documento"
                    value={tempProfile.idDocument as string}
                    onInput={(e) => setTempProfile({...tempProfile, idDocument: e.target.value})}
                    placeholder="Dni, sin puntos ni espacios"
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
                    type="text"
                  />
                </div>
              </>
              }
            </> }
          </form>
        </div>
        <FooterMenu>
          <Button variant="secondary" full onClick={saveHandler}>
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Guardar Usuario
          </Button>
          { tempProfile.status === 'pending' ? <Button variant="secondary" full onClick={activateHandler}>
            <FontAwesomeIcon icon={faThumbsUp} className="me-2" />
            Activar usuario
          </Button> : <></> }
          <Button variant="secondary" full onClick={deleteHandler}>
            <FontAwesomeIcon icon={faTrashCan} className="me-2" />
            Desactivar Usuario
          </Button>
        </FooterMenu>
      </div>
    </div>
  )
}

export default UserView