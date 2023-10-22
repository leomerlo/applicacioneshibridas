import { useNavigate } from "react-router-dom"
import { useProfile } from "../contexts/ProfileContext"
import { useEffect } from "react";

function RouteAdmin({children}: {children: React.ReactNode}){
    const { profile } = useProfile();
    const navigate = useNavigate();
    
    useEffect(() => {
      if(
        profile.accountId !== '' &&
        profile.accountType !== 'admin'
      ){
        navigate("/");
      }
    }, [profile]);

    return profile.accountId ? children : null;
}

export default RouteAdmin