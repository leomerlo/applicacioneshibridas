import { useEffect, useState } from 'react'
import authService from '../services/auth.service'
import { useNavigate } from 'react-router'
import Button, { ButtonType } from '../components/Button'
import Input from '../components/Input'
import Logo from '../assets/logoAlt.svg'
import LoginImage from '../assets/loginImage.png'
import backGradient from '../assets/backGradient.svg'
import { Link } from 'react-router-dom'
import { useNotifications } from '../contexts/NotificationsContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons' 
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import NotificationsBlock from '../components/NotificationsBlock'

const Login = () => {
  const userTexts = {
    title: "Bienvenid@ a SAZ!",
    splashTitle: "Despierta al chef que llevas dentro.",
    splashSubtitle: "Con SAZ!, tu asistente culinario personal.",
    changeButtonText: "Soy Nutricionista",
    chanceButtonIcon: faCarrot,
    registerLink: '/register/user'
  }

  const nutriTexts = {
    title: "Ingresa como nutricionista",
    splashTitle: "Bienvenido a SAZ!",
    splashSubtitle: "Tu plataforma personalizada de asistencia nutricional. ¡Prepárate para transformar la salud a través de la ciencia de la alimentación!",
    changeButtonText: "Soy Usuario / Paciente",
    chanceButtonIcon: faUser,
    registerLink: '/register/nutri'
  }

  const navigate = useNavigate()
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [uiTexts, setUiTexts] = useState(userTexts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateNotifications } = useNotifications();

  const login = () => {
    setLoading(true);
    authService.login({ userName, password }).then((data) => {
      setLoading(false);
      setError("");
      if(data.status === 200) {
        const response = data.data.token
        localStorage.setItem('token', response.token);
        if(response.profile.accountType === 'admin') {
          navigate('/admin', {replace: true});
        } else {
          navigate('/', {replace: true});
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    })
  }

  useEffect(() => {
    setUiTexts(userType === "user" ? userTexts : nutriTexts);
  }, [userType]);

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const userTypeHandler = (): void => {
    setUserType(userType === "user" ? "nutri" : "user");
  }

  return (
    <>
      <div className="h-screen flex flex-col lg:flex-row">
        <NotificationsBlock />
        <div className="basis-1/2 flex flex-col py-16 px-6">
          <div className="flex justify-center items-center flex-grow">
            <div className="block h-fit max-w-authForm">
              <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                <div className="text-center">
                  <h1 className="text-4xl text-gray-80">{uiTexts.title}</h1>
                  <p className="text-base text-gray-70 mt-3">Ingresa tus datos para comenzar a disfrutar de SAZ!.</p>
                </div>
                <div className="mt-8">
                  <Input name="userName" type="email" label="Email" value={userName} onInput={userNameHandler} placeholder="Escribi tu email" />
                </div>
                <div className="mt-8">
                  <Input name="password" error={error} label="Contraseña" value={password} onInput={passwordHandler} placeholder="Escribi tu contraseña" type="password" />
                </div>
                <div className="mt-8">
                  <Button type={ButtonType.submit} full loading={loading}>Ingresá</Button>
                </div>
              </form>
              <div className="mt-8 text-center">
                <Link to="/forgotPassword" className="text-primary-main">Olvidé mi contraseña</Link>
              </div>
              <div className="mt-8 text-center">
                <span className="text-gray-60">¿No tienes una cuenta? <Link to={uiTexts.registerLink} className="text-primary-main">Regístrate!</Link></span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button onClick={userTypeHandler} className="text-primary-main">
              <FontAwesomeIcon className="me-4" icon={uiTexts.chanceButtonIcon} /> {uiTexts.changeButtonText}
            </button>
          </div>
        </div>
        <div
          // @ts-ignore
          style={{'--image-url': `url(${backGradient})`}} 
          className="basis-1/2 flex justify-center items-center px-12 py-16 lg:py-6 lg:px-28 bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center"
        >
          <div className="w-fit h-fit text-center">
            <img src={Logo} alt="SAZ!" className="mx-auto" />
            <img src={LoginImage} aria-hidden="true" className="mt-20 mx-auto" />
            <div>
              <p className="text-3xl text-white mt-20">
                <strong className="block">{uiTexts.splashTitle}</strong>
                {uiTexts.splashSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login