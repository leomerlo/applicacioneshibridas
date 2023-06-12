import React, { useEffect } from 'react'
import API from "../services/api.service";
import { useNavigate } from 'react-router'

const Login = () => {

  const navigate = useNavigate()

  function login({ userName, password }: { userName: String, password: String }) {
    return API.call({ uri: 'session', method: 'POST', body: { userName, password } })
  }

  useEffect(() => {
    login({ userName: 'Leo', password: '1234' }).then((data) => {
      const response = data.data.token

      localStorage.setItem('token', response.token);

      navigate('/', {replace: true}) 
    })
  }, [])

  return (
    <div>Login</div>
  )
}

export default Login