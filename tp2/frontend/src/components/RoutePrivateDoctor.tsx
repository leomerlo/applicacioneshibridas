import { useProfile } from "../contexts/ProfileContext"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoutePrivateDoctor({children}: {children: React.ReactNode}){
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // if(profile.accountType !== 'doc'){
    //   navigate('/notAllowed');
    // }
  }, [profile]);

  return children
}

export default RoutePrivateDoctor