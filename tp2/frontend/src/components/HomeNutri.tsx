import { useProfile } from "../contexts/ProfileContext";
import LoginImage from '../assets/loginImage.png'
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import PatientList from "./PatientList";
import FooterMenu from "./FooterMenu";

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
        <p className="text-center">Mientras se aprueba, podés modificar tu nombre desde el perfil.</p>
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
        <img src={LoginImage} aria-hidden className="my-8 w-1/3 mx-auto" />
        <p className="text-center">Tu cuenta se encuentra aprobada,</p>
        <p className="text-center">pero no tenés una subscripcion activa.</p>
        <div className="mx-auto mt-4">
          <Button onClick={gotoSubscriptions}>Activar subscripción</Button>
        </div>
      </>
    )
  };

  const renderActive = () => {
    return (
      <>
        { patients ? <>
          <PatientList />
        </> : <>
          <div>
            <h1 className="text-4xl mt-6 text-center">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
          </div>
          <div className="flex-grow">
            <img src={LoginImage} aria-hidden className="my-8" />
            <h2 className="text-2xl text-center">Aún no tenés pacientes cargados en tu perfil.</h2>
          </div>
        </> }
      </>
    )
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
    <div className="container mx-auto h-full justify-start">
      <div className="flex flex-col h-full pb-20">
        { renderSwitch() }
        <FooterMenu>
          { profile.status === 'pending' || profile.status === 'inactive' ? <></> : <>
            <Button onClick={addPatientHandler} full>Agregar paciente</Button>
            <Button onClick={myPlansHandler} full>Mis planes</Button>
          </>
          }
        </FooterMenu>
      </div>
    </div>
  )
}

export default HomeNutri