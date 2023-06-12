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
      <button className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={logout}>Logout</button>
      <Outlet />
    </>
  )
}

export default App
