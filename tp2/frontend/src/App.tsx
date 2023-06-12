import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router'
import authService from './services/auth.service';
import './App.scss'

function App() {

  const navigate = useNavigate()

  const logout = () => {
    authService.logout().then(() => {
      localStorage.removeItem('token');

      navigate('/login', {replace: true});
    });
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export default App
