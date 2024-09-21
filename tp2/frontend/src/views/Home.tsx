import { useProfile } from "../contexts/ProfileContext";
import Loading from "../components/Loading";
import HomeNutri from "../components/HomeNutri";
import HomeUser from "../components/HomeUser";

const Home = () => {
  const { profile } = useProfile();

  return (
    <>
      { (profile.accountId != '' ) ? <>
        { profile.accountType === 'doc' ? <HomeNutri /> : <HomeUser /> }
      </> : <Loading action="Estamos cargando tus datos..." /> }
    </>
  )
}

export default Home