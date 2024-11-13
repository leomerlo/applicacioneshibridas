import { useEffect, useState } from "react";
import backofficeService from "../../services/backoffice.service";
import { useNotifications } from "../../contexts/NotificationsContext";
import type { Profile } from "../../contexts/ProfileContext";
import GoBack from "../../components/GoBack";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import Input from "../../components/Input";
import { Link, useParams } from "react-router-dom";
import NutriLayout from "../../components/NutriLayout";
import UserSidebar from "../../components/UserSidebar";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import SubscriptionActiveStatus from "../../components/SubscriptionActiveStatus";
import { Plan } from "../../contexts/PlanContext";
import planService from "../../services/plan.service";

const UserView = () => {
  const { id } = useParams();
  const notifications = useNotifications();
  const [userProfile, setUserProfile] = useState({} as Profile);
  const [tempProfile, setTempProfile] = useState({} as Profile);
  const [plans, setPlans] = useState([] as Plan[]);

  useEffect(() => {
      backofficeService.getAccount(id as string).then((resp) => {
      if(resp.status === 200) {
        setUserProfile(resp.data);
      } else {
        notifications.updateNotifications({
          variant: 'error',
          message: 'Error al obtener el perfil'
        });
      }
    });
  }, [id]);

  useEffect(() => {
    setTempProfile(userProfile);
    if (userProfile._id) {
      planService.getPlansById(userProfile._id as string).then((resp) => {
        if (resp.status === 200) {
          setPlans(resp.data);
        } else {
          notifications.updateNotifications({
            variant: 'error',
            message: 'Error al obtener los planes'
          });
        }
      });
    }
  }, [userProfile])

  const saveHandler = () => {
    backofficeService.updateAccount(userProfile._id as string, tempProfile).then((resp) => {
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
    backofficeService.deactivateAccount(userProfile._id as string).then((resp) => {
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
    backofficeService.updateAccount(userProfile._id as string, { ...tempProfile, status: 'active' }).then((resp) => {
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
    <NutriLayout
      sidebar={
        <UserSidebar active={id} />
      }
      content={
        <div className="container-fluid mx-auto h-full">
          <div className="flex flex-col h-full pb-20">
            <div>
              <GoBack />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h1 className="text-4xl mt-6">{tempProfile.email}</h1>
                <div className="flex gap-3 items-center">
                  <Button size="small" variant="primary" onClick={saveHandler}>
                    <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
                    Guardar
                  </Button>
                  { tempProfile.status !== 'active'  ? <Button size="small" variant="secondary" onClick={activateHandler}>
                    <FontAwesomeIcon icon={faThumbsUp} className="me-2" />
                    Activar
                  </Button> : <></> }
                  { tempProfile.status !== 'inactive'  ? <Button size="small" variant="secondary" onClick={deleteHandler}>
                    <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                    Desactivar
                  </Button> : <></> }
                </div>
              </div>
              <form onSubmit={saveHandler}>
                <div>
                  <Input
                    name="name"
                    label="Nombre"
                    value={tempProfile.name}
                    onInput={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                    type="text"
                  />
                </div>
                <div className="flex mt-4">
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
                <div className="flex flex-col gap-4">
                  { tempProfile.accountType === 'admin' ? <></> : <>
                    { tempProfile.accountType === 'user' ? <>
                    { !tempProfile.docId ? <>
                      <div>
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
                      <div>
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
                      <div>
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
                          <FontAwesomeIcon icon={faWarning} />
                        </span>
                        <span className="flex-grow">Este usuario está siendo administrado por un nutricionista. Solo este puede modificar su dieta.</span>
                      </div>
                    </>}
                    </> : <>
                      <div>
                        <Input
                          name="idDocument"
                          label="Documento"
                          value={tempProfile.idDocument as string}
                          onInput={(e) => setTempProfile({...tempProfile, idDocument: e.target.value})}
                          placeholder="Dni, sin puntos ni espacios"
                          type="text"
                        />
                      </div>
                      <div>
                        <Input
                          name="idLicense"
                          label="Matricula"
                          value={tempProfile.idLicense as string}
                          onInput={(e) => setTempProfile({...tempProfile, idLicense: e.target.value})}
                          placeholder="Matricula, sin puntos ni espacios"
                          type="text"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl my-4">Suscripción</h2>
                        { tempProfile.subscription_start ? <>
                          <SubscriptionActiveStatus profile={tempProfile} />
                        </> : <>
                          <span>No tiene suscripción activa</span>
                        </>}
                      </div>
                      <div>
                        <h2 className="text-xl my-4">Planes</h2>
                        { plans.length === 0 ? <span>No tiene planes</span> : <>
                          { plans.map((plan) => (
                            <div key={plan._id} className="bg-white rounded-lg shadow-lg p-5 mb-2 flex justify-between">
                              <Link to={`/plan/${plan._id}`}>{plan.meta.title}</Link>
                            </div>
                          )) }
                        </>}
                      </div>
                    </>
                    }
                  </> }
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    />
  )
}

export default UserView