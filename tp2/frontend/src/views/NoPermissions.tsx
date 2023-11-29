import { useNavigate } from 'react-router-dom';
import LoginImage from '../assets/loginImage.png';
import Button from '../components/Button';

const NoPermissions = () => {
  const navigate = useNavigate();

  const backHomeHandler = () => {
    navigate('/');
  }

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <h1 className="text-4xl text-gray-80 my-8 text-center">No tenés permisos para ver esta sección</h1>
          <img src={LoginImage} aria-hidden className="my-8 mx-auto" />
        </div>
        <Button full onClick={backHomeHandler}>Volver al inicio</Button>
      </div>
    </div>
  )
}

export default NoPermissions