import { Link } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { faUser, faStethoscope, faFileLines, faRightFromBracket, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ItemProps {
  to: string;
  label: string;
  icon: IconDefinition;
}

const NavBarItem = (props: ItemProps) => {
  return (
    <li className="hover:text-primary-hover">
      <Link to={props.to}>
        <div className="text-heading-sm mb-2 text-center">
          <FontAwesomeIcon icon={props.icon} />
        </div>
        <span className="text-body-xs block text-center">{props.label}</span>
      </Link>
    </li>
  )
}

const NavBarMobile = () => {
  const { profile } = useProfile();
  
  return (
    <nav className="px-6 items-center shadow-reverse-2xl m-row">
      <ul className="flex w-full justify-around p-2">
        { profile.accountType === 'admin' ? <>
          <NavBarItem to={'/admin'} label={'Usuarios'} icon={faScrewdriverWrench} />
          </> : <></> }
        { profile.accountType === 'doc' && profile.status === 'active' ? <>
          <NavBarItem to={'/patients'} label={'Mis pacientes'} icon={faStethoscope} />
          <NavBarItem to={'/plans'} label={'Mis planes'} icon={faFileLines} />
        </> : <></> }
        { profile.accountType === 'user' && (
          <NavBarItem to={'/'} label={'Mi plan'} icon={faFileLines} />
        )}
        { (profile.accountType === 'user' || profile.accountType === 'doc') && (
          <NavBarItem to={'/profile'} label={'Mi perfil'} icon={faUser} />
        )}
        <NavBarItem to={'/logout'} label={'Cerrar Sesión'} icon={faRightFromBracket} />
      </ul>
    </nav>
  )
}

export default NavBarMobile