import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useProfile } from "../contexts/ProfileContext";

const HomeNutri = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // Inactive and pending users should only see their profile
    if (profile.status != 'active') {
      navigate('/profile');
    } else {
      navigate('/patients');
    }
  }, []);

}

export default HomeNutri