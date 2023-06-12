import { useEffect } from 'react'
import apiService from '../../services/api.service'
import './Home.scss'

const Home = () => {

  useEffect(() => {
    apiService.call({ uri: 'profile', method: 'GET' }).then((data) => {
      console.log(data.data);
    });
  }, [])

  return (
    <>
      <div>Home</div>
    </>
  )
}

export default Home