import { useProfile } from "../contexts/ProfileContext";
import LoginImage from '../assets/loginImage.png'
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import PatientList from "./PatientList";

const HomeNutri = () => {
  const { profile, patients } = useProfile();
  const navigate = useNavigate();

  const addPatientHandler = () => {
    navigate('/addPatient');
  }
  
  const myPlansHandler = () => {
    navigate('/plans');
  }

  const gotoProfile = () => {
    navigate('/profile');
  }

  const gotoSubscriptions = () => {
    navigate('/subscription');
  }

  const renderInactive = () => {
    return (
      <>
        <div>
          <h1 className="text-4xl mt-6 text-center">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
        </div>
        <img src={LoginImage} aria-hidden className="my-8 w-1/3 mx-auto" />
        <p className="text-center">Tu cuenta está pendiente de aprobación.</p>
        <p className="text-center">Te avisaremos cuando esté lista.</p>
        <div className="mx-auto mt-4">
          <Button onClick={gotoProfile}>Ir a mi perfil</Button>
        </div>
      </>
    )
  }

  const renderPending = () => {
    return (
      <>
        <div>
          <h1 className="text-4xl mt-6 text-center">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
        </div>
        <p className="text-center mt-8">Tu cuenta se encuentra aprobada,</p>
        <p className="text-center">pero no tenés una subscripcion activa.</p>
        <div className="mx-auto mt-4">
          <Button onClick={gotoSubscriptions}>Activar subscripción</Button>
        </div>
      </>
    )
  };

  const renderActive = () => {
    navigate('/patients');
  }

  const renderSwitch = () => {
    switch(profile.status) {
      case 'inactive':
        return renderInactive();
      case 'pending':
        return renderPending();
      case 'active':
        return renderActive();
      default:
        return <></>;
    }
  }

  return (
    <>
      { renderSwitch() }
    </>
  )
}

export default HomeNutri