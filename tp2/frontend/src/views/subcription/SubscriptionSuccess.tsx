import { useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext"
import { useNavigate } from "react-router-dom";

const SubscriptionSuccess = () => {
  const { refreshProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    refreshProfile();
    navigate('/');
  }, []);

  return (
    <></>
  )
}

export default SubscriptionSuccess