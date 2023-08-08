import { useProfile } from "../contexts/ProfileContext";
import LoginImage from '../assets/loginImage.png'
import Button from "./Button";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="container mx-auto h-full justify-start">
      <div className="flex flex-col h-full pb-20">
        { profile.status === 'pending' ? <>
          <div>
            <h1 className="text-4xl mt-6 text-center">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
          </div>
          <img src={LoginImage} aria-hidden className="my-8" />
          <p className="text-center">Tu cuenta está pendiente de aprobación.</p>
        </> : <>
          { patients ? <>
            <div>
              <h1 className="text-4xl mt-6 mb-2 text-left">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
            </div>
            <PatientList />
          </> : <>
            <div>
              <h1 className="text-4xl mt-6 text-center">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
            </div>
            <div className="flex-grow">
              <img src={LoginImage} aria-hidden className="my-8" />
              <h2 className="text-2xl text-center">Todavía no tenés pacientes cargados en tu perfil.</h2>
            </div>
          </> }
        </>}
        <FooterMenu>
          <Button onClick={addPatientHandler} full>Agregar paciente</Button>
          <Button onClick={myPlansHandler} full>Mis planes</Button>
        </FooterMenu>
      </div>
    </div>
  )
}

export default HomeNutri