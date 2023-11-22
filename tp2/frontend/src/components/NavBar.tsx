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
    <nav className={`flex flex-col items-center justify-between fixed z-20 top-0 left-0 w-full bg-white p-2 ${menuOpen ? "h-screen" : "h-navbar"} transition-all duration-500 ease-in-out`}>
      <div className="flex container justify-between items-center">
        <div className="flex items-center flex-shrink-0 mr-6">
          <Link to={profile.accountType === 'admin' ? '/admin' : '/'} className="block">
            <img src={logo} aria-hidden="true" className="h-12" />
          </Link>
        </div>
        <div className="block">
          <button className="flex items-center px-3 py-2 text-primary-main hover:text-primary-secondary transition-colors duration-300 ease-in-out" onClick={() => {setMenuOpen(menuOpen ? false : true)}}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
      <div className={`container flex flex-col justify-between bg-white flex-grow ${menuOpen ? "" : "h-0"} overflow-y-hidden`}>
        <div className="text-sm mt-4">
          <Link to={profile.accountType === 'admin' ? '/admin' : '/'} className="block py-8" onClick={() => {setMenuOpen(false)}}>Home</Link>
          { profile.accountType !== 'admin' ? <>
          <Link to={'/plan'} className="block py-8" onClick={() => {setMenuOpen(false)}}>Mi Plan</Link>
          <Link to={'/profile'} className="block py-8" onClick={() => {setMenuOpen(false)}}>Mi Perfil</Link>
          { plan ? <Link to={'/shoppingList'} className="block py-8" onClick={() => {setMenuOpen(false)}}>Lista de compras</Link> : <></> }
          </> : <></> }
        </div>
        <div>
          <Button onClick={logout} full>Logout</Button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar