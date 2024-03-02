import { useEffect } from "react";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";

const SubscriptionError = () => {
  const { updateNotifications } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    updateNotifications({ variant: 'error', message: 'Error en la suscripción, intentalo nuevamente' });
    navigate('/subscription');
  }, []);

  return (<></>)
}

export default SubscriptionError