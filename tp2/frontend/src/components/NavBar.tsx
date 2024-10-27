import { useState } from 'react'
import { useNavigate } from 'react-router'
import authService from '../services/auth.service';
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { usePlan } from '../contexts/PlanContext';
import { useProfile } from '../contexts/ProfileContext';


const NavBar = () => {
  const { plan } = usePlan();
  const { profile } = useProfile();
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    authService.logout().then(() => {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }).catch((err) => {
      throw new Error(err);
    });
  }
  
  return (
    <nav className="px-6 py-4 flex justify-between items-center border-b border-b-gray-40">
      <div className="flex gap-12 items-center">
        <img src={logo} aria-hidden="true" className="h-4" />
        <ul className="flex gap-3">
          { profile.accountType === 'admin' ? <li>
            <Link to={'/admin'} className="block p-4">Inicio</Link>
          </li> : <></> }
          { profile.accountType === 'doc' ? <>
            <li><Link to={'/patients'} className="block p-4">Mis pacientes</Link></li>
            <li><Link to={'/plans'} className="block p-4">Mis planes</Link></li>
            <li><Link to={'/profile'} className="block p-4">Mi perfil</Link></li>
          </> : <></> }
        </ul>
      </div>
      <Button className="grow-0" onClick={logout} variant="secondary" size="small">Cerrar sesión</Button>
    </nav>
  )
}

export default NavBar