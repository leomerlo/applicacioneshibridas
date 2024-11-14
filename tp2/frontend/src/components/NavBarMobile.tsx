import { Link } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

interface ItemProps {
  to: string;
  label: string;
}

const NavBarItem = (props: ItemProps) => {
  return (
    <li className="hover:bg-blue-200 hover:text-white flex-grow text-center">
      <Link to={props.to} className="block px-4 py-6">{props.label}</Link>
    </li>
  )
}

const NavBarMobile = () => {
  const { profile } = useProfile();
  
  return (
    <nav className="px-6 items-center border-t border-t-gray-40 m-row">
      <ul className="flex w-full justify-evenly">
        { profile.accountType === 'admin' ? <>
          <NavBarItem to={'/admin'} label={'Usuarios'} />
          </> : <></> }
        { profile.accountType === 'doc' && profile.status === 'active' ? <>
          <NavBarItem to={'/patients'} label={'Mis pacientes'} />
          <NavBarItem to={'/plans'} label={'Mis planes'} />
        </> : <></> }
        { (profile.accountType === 'user' || profile.accountType === 'doc') && (
          <NavBarItem to={'/profile'} label={'Mi perfil'} />
        )}
        <NavBarItem to={'/logout'} label={'Cerrar Sesión'} />
      </ul>
    </nav>
  )
}

export default NavBarMobile