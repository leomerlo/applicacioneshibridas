import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router'
import authService from './services/auth.service';
import './App.css'

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
      <button className="button" onClick={logout}>Logout</button>
      <Outlet />
    </>
  )
}

export default App
