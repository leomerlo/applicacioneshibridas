import { useProfile } from "../contexts/ProfileContext";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import GoBack from "./GoBack";
import SubscriptionInfo from "./SubscriptionInfo";
import { useEffect, useState } from "react";

const SubscriptionStatus = () => {
  const { profile } = useProfile();
  const [subscriptionStart, setSetsubscriptionStart] = useState<string | null>(null);
  const [subscriptionEnd, setSetsubscriptionEnd] = useState<string | null>(null);

  useEffect(() => {
    const startDate = new Date(profile.subscription_start as Date);
    const endDate = new Date(profile.subscription_start as Date);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const endDateStr = endDate.toLocaleDateString('es-AR', options);
    const startDateStr = startDate.toLocaleDateString('es-AR', options);
    setSetsubscriptionEnd(endDateStr);
    setSetsubscriptionStart(startDateStr);
  }, [profile]);

  const renderInactive = () => {
    return (<>
        <div>
          <p>Tu cuenta está pendiente de aprobación.</p>
          <p>Te avisamos cuando esté lista.</p>
        </div>
    </>)
  };

  const renderPending = () => {
    return (
      <>
        <div>
          <p>Tu cuenta se encuentra aprobada, pero no tenés una subscripcion activa.</p>
          <div>
            <SubscriptionInfo />
          </div>
        </div>
      </>
    )
  };

  const renderActive = () => {
    return (<>
      <ul>
        <li>
          <div className="flex gap-4">
            <span>Estado</span>
            <span>Activa</span>
          </div>
        </li>
        <li className="mt-4">
          <p><span>Activada el { subscriptionStart }</span></p>
          <p>Tu cuenta se desactivará automaticamente el <b>{ subscriptionEnd }</b></p>
        </li>
      </ul>
    </>)
  }

  const renderSwitch = () => {
    switch(profile.status) {
      case 'inactive':
        return renderInactive();
      case 'pending':
        return renderPending();
      case 'active':
        return renderActive();
      default:
        return <></>;
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <GoBack />
      </div>
      <div className="flex flex-col gap-4 justify-between">
        <h1 className="text-4xl mt-6">Mi Suscripción</h1>
        { renderSwitch() }
      </div>
    </>
  )
}

export default SubscriptionStatus