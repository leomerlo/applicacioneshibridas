import { useEffect, useState } from 'react'
import { Profile, useProfile } from '../contexts/ProfileContext';

export interface Props {
  profile: Profile
};

const SubscriptionActiveStatus = (props: Props) => {
  const [subscriptionStart, setSetsubscriptionStart] = useState<string | null>(null);
  const [subscriptionEnd, setSetsubscriptionEnd] = useState<string | null>(null);

  useEffect(() => {
    const startDate = new Date(props.profile.subscription_start as Date);
    const endDate = new Date(props.profile.subscription_start as Date);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const endDateStr = endDate.toLocaleDateString('es-AR', options);
    const startDateStr = startDate.toLocaleDateString('es-AR', options);
    setSetsubscriptionEnd(endDateStr);
    setSetsubscriptionStart(startDateStr);
  }, [props.profile]);

  useEffect(() => {
    useProfile
  });

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
        <p>Se desactivará automaticamente el <b>{ subscriptionEnd }</b></p>
      </li>
    </ul>
  </>)
}

export default SubscriptionActiveStatus