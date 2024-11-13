import { useProfile } from "../contexts/ProfileContext";
import GoBack from "./GoBack";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionActiveStatus from "./SubscriptionActiveStatus";

const SubscriptionStatus = () => {
  const { profile } = useProfile();

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
    return (<SubscriptionActiveStatus profile={profile} />)
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