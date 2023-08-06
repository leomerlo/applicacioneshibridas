import { useState } from 'react'
import { Link } from 'react-router-dom'
import accountService from '../services/account.service'
import authService from '../services/auth.service'
import { useNavigate } from 'react-router'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../assets/logoAlt.svg'
import LoginImage from '../assets/loginImage.png'
import backGradient from '../assets/backGradient.svg'
import { useNotifications } from '../contexts/NotificationsContext'
import { useParams } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()
  const { updateNotifications } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [idDocument, setIdDocument] = useState("");
  const [idLicense, setIdLicense] = useState("");
  const [error, setError] = useState("");
  const { type } = useParams();

  const getUserData = () => {
    let userData: any = {};
    if(type === 'nutri') {
      userData = {
        userName,
        password,
        type: 'doc',
        idDocument,
        idLicense,
        email: userName
      }
    } else {
      userData = {
        userName,
        password,
        type: 'user',
      }
    }

    return userData;
  };

  const register = () => {
    setLoading(true);
    accountService.register(getUserData()).then((resp) => {
      setLoading(false);
      setError("");
      if(resp.status === 201) {
        updateNotifications({ variant: 'success', message: 'Usuario creado con éxito' });
        authService.login({ userName, password }).then((resp) => {
          const response = resp.data.token
          localStorage.setItem('token', response.token);
          navigate('/', {replace: true})
        });
      } else {
        setError(resp.data.error.message || "Error al registrarse");
      }
    }).catch((error) => {
      throw new Error(error);
    });
  }

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const idDocumentHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdDocument(event.target.value)
  }

  const idLicenseHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdLicense(event.target.value)
  }

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="basis-1/2 flex justify-center items-center py-16 px-6">
          <div className="block h-fit max-w-authForm">
            <div className="text-center">
              <h1 className="text-4xl text-gray-80">Bienvenid@ a Food Genie!</h1>
              <p className="text-base text-gray-70 mt-3">Ingresa tus datos a continuación y comienza a explorar un mundo de deliciosas recetas personalizadas.</p>
            </div>
            <div className="mt-8">
              <Input name="userName" type="email" label="Email" value={userName} onInput={userNameHandler} placeholder="Escribi tu email" />
            </div>
            <div className="mt-8">
              <Input name="password" label="Contraseña" value={password} onInput={passwordHandler} placeholder="Escribi tu contraseña" type="password" />
            </div>
            { type === 'nutri' ? <>
              <div className="mt-8">
                <Input name="idDocument" label="Documento" value={idDocument} onInput={idDocumentHandler} placeholder="Dni, sin puntos ni espacios" type="text" />
              </div>
              <div className="mt-8">
                <Input name="idLicense" error={error} label="Licencia" value={idLicense} onInput={idLicenseHandler} placeholder="Licencia, sin puntos ni espacios" type="text" />
              </div>
            </> : null }
            <div className="mt-8">
              <Button full loading={loading} onClick={register}>Registrate</Button>
            </div>
            <div className="mt-8 text-center">
              <span className="text-gray-60">¿Ya tienes una cuenta? <Link to={'/login'} className="text-primary-main">Ingresá!</Link></span>
            </div>
          </div>
        </div>
        <div
          // @ts-ignore
          style={{'--image-url': `url(${backGradient})`}} 
          className="basis-1/2 flex justify-center items-center px-12 py-16 lg:py-6 lg:px-28 bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center"
        >
          <div className="h-fit text-center">
            <img src={Logo} alt="Food Genie" className="mx-auto" />
            <img src={LoginImage} aria-hidden="true" className="mt-20 mx-auto" />
            <div>
              <p className="text-3xl text-white mt-20">
                <strong className="block">Tu guía mágica hacia un universo de sabores.</strong>
                Descubre recetas inspiradoras, crea platos sorprendentes y comparte tu pasión por la cocina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register