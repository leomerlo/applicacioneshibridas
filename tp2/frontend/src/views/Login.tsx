import authService from '../services/auth.service'
import { useNavigate } from 'react-router'

const Login = () => {

  const navigate = useNavigate()

  const login = () => {
    authService.login({ userName: 'Leo', password: '1234' }).then((data) => {
      const response = data.data.token

      localStorage.setItem('token', response.token);

      navigate('/', {replace: true}) 
    })
  }

  return (
    <>
      <div>Login</div>
      <button className="button" onClick={login}>Login</button>
    </>
  )
}

export default Login