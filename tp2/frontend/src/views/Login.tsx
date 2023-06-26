import { useState } from 'react'
import authService from '../services/auth.service'
import { useNavigate } from 'react-router'
import Button, { ButtonType } from '../components/Button'
import Input from '../components/Input'
import Logo from '../assets/logoAlt.svg'
import LoginImage from '../assets/loginImage.png'
import backGradient from '../assets/backGradient.svg'
import { Link } from 'react-router-dom'
import { useNotifications } from '../contexts/NotificationsContext'

const Login = () => {

  const navigate = useNavigate()
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateNotifications } = useNotifications();

  const login = () => {
    authService.login({ userName, password }).then((data) => {
      setError("");
      if(data.status === 200) {
        const response = data.data.token
        localStorage.setItem('token', response.token);
        updateNotifications({ variant: 'success', message: 'Usuario logueado con éxito' });
        navigate('/', {replace: true}) 
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    })
  }

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  return (
    <>
      <div className="h-screen flex flex-col lg:flex-row">
        <div className="basis-1/2 flex justify-center items-center py-16 px-6">
          <div className="block h-fit max-w-authForm">
            <form onSubmit={(e) => { e.preventDefault(); login(); }}>
              <div className="text-center">
                <h1 className="text-4xl text-gray-80">Bienvenid@ a Food Genie!</h1>
                <p className="text-base text-gray-70 mt-3">Ingresa tus datos para comenzar a disfrutar de Food Genie.</p>
              </div>
              <div className="mt-8">
                <Input name="userName" type="email" label="Email" value={userName} onInput={userNameHandler} placeholder="Escribi tu email" />
              </div>
              <div className="mt-8">
                <Input name="password" error={error} label="Contraseña" value={password} onInput={passwordHandler} placeholder="Escribi tu contraseña" type="password" />
              </div>
              <div className="mt-8">
                <Button type={ButtonType.submit} full>Ingresá</Button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <span className="text-gray-60">¿No tienes una cuenta? <Link to={'/register'} className="text-primary-main">Regístrate!</Link></span>
            </div>
          </div>
        </div>
        <div
          style={{'--image-url': `url(${backGradient})`}} 
          className="basis-1/2 flex justify-center items-center px-12 py-16 lg:py-6 lg:px-28 bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center"
        >
          <div className="w-fit h-fit text-center">
            <img src={Logo} alt="Food Genie" className="mx-auto" />
            <img src={LoginImage} aria-hidden="true" className="mt-20 mx-auto" />
            <div>
              <p className="text-3xl text-white mt-20">
                <strong className="block">Despierta al chef que llevas dentro.</strong>
                Con Food Genie, tu asistente culinario personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login