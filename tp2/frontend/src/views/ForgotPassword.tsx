import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Button, { ButtonType } from '../components/Button'
import Input from '../components/Input'
import Logo from '../assets/logoAlt.svg'
import LoginImage from '../assets/loginImage.png'
import backGradient from '../assets/backGradient.svg'
import { Link } from 'react-router-dom'
import { faUser } from '@fortawesome/free-regular-svg-icons' 
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import accountService from '../services/account.service'
import { useNotifications } from '../contexts/NotificationsContext'
import NotificationsBlock from '../components/NotificationsBlock'

const ForgotPassword = () => {
  const userTexts = {
    title: "Bienvenid@ a Food Genie!",
    splashTitle: "Despierta al chef que llevas dentro.",
    splashSubtitle: "Con Food Genie, tu asistente culinario personal.",
    changeButtonText: "Soy Nutricionista",
    chanceButtonIcon: faCarrot,
    registerLink: '/register/user'
  }

  const nutriTexts = {
    title: "Ingresa como nutricionista",
    splashTitle: "Bienvenido a Food Genie",
    splashSubtitle: "Tu plataforma personalizada de asistencia nutricional. ¡Prepárate para transformar la salud a través de la ciencia de la alimentación!",
    changeButtonText: "Soy Usuario / Paciente",
    chanceButtonIcon: faUser,
    registerLink: '/register/nutri'
  }

  const navigate = useNavigate()
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("user");
  const [uiTexts, setUiTexts] = useState(userTexts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const notification = useNotifications();

  const resetPassword = () => {
    setLoading(true);
    console.log('reset')
    accountService.forgotPassword(userName).then((resp) => {
      console.log('reset2')
      setLoading(false);
      setError("");
      if(resp.status === 201) {
        console.log('reset3')
        navigate('/login');
        notification.updateNotifications({
          variant: "success",
          message: "Se ha enviado un correo con tu nueva contraseña."
        })
      } else {
        notification.updateNotifications({
          variant: "success",
          message: resp.data.error.message
        })
      }
    })
  }

  useEffect(() => {
    setUiTexts(userType === "user" ? userTexts : nutriTexts);
  }, [userType]);

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  return (
    <>
      <div className="h-screen flex flex-col lg:flex-row">
        <NotificationsBlock />
        <div className="basis-1/2 flex flex-col py-16 px-6">
          <div className="flex justify-center items-center flex-grow">
            <div className="block h-fit max-w-authForm">
              <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                <div className="text-center">
                  <h1 className="text-4xl text-gray-80">Recuperá tu contraseña</h1>
                  <p className="text-base text-gray-70 mt-3">Ingresa tu email para generar una nueva contraseña.</p>
                </div>
                <div className="mt-8">
                  <Input name="userName" type="email" label="Email" error={error} value={userName} onInput={userNameHandler} placeholder="Escribi tu email" />
                </div>
                <div className="mt-8">
                  <Button type={ButtonType.submit} full loading={loading}>Generar nueva contraseña</Button>
                </div>
              </form>
              <div className="mt-8 text-center">
                <span className="text-gray-60">¿Ya tenés una cuenta? <Link to="/login" className="text-primary-main">Ingresá!</Link></span>
              </div>
            </div>
          </div>
        </div>
        <div
          // @ts-ignore
          style={{'--image-url': `url(${backGradient})`}} 
          className="basis-1/2 flex justify-center items-center px-12 py-16 lg:py-6 lg:px-28 bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center"
        >
          <div className="w-fit h-fit text-center">
            <img src={Logo} alt="Food Genie" className="mx-auto" />
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

export default ForgotPassword