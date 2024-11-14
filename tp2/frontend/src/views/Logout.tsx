import { useEffect } from 'react'
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout().then(() => {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }).catch((err) => {
      throw new Error(err);
    });
  }, []);

  return (<></>)
}

export default Logout