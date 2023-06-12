import React, { useEffect } from 'react'
import apiService from '../services/api.service'

const Home = () => {

  useEffect(() => {
    apiService.call({ uri: 'profile', method: 'GET' }).then((data) => {
      console.log(data.data);
    });
  }, [])

  return (
    <div>Home</div>
  )
}

export default Home