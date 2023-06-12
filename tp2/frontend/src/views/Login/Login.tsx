import authService from '../../services/auth.service'
import { useNavigate } from 'react-router'
import './Login.scss';

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
      <button className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={login}>Login</button>
    </>
  )
}

export default Login