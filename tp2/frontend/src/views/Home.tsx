import { useEffect } from 'react'
import apiService from '../services/api.service'
import Button from '../components/Button'
import authService from '../services/auth.service'
import { useNavigate } from 'react-router'

const Home = () => {

  const navigation = useNavigate();

  useEffect(() => {
    apiService.call({ uri: 'profile', method: 'GET' }).then((data) => {
      console.log(data.data);
    });
  }, [])

  const logout = () => {
    authService.logout().then(() => {
      localStorage.removeItem('token');
      navigation('/login', { replace: true });
    }).catch((err) => {
      throw new Error(err);
    });
  }

  return (
    <>
      <div>Home</div>
      <Button onClick={logout}>Logout</Button>
    </>
  )
}

export default Home