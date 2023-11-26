import { useProfile } from "../contexts/ProfileContext";
import Loading from "../components/Loading";
import HomeNutri from "../components/HomeNutri";
import HomeUser from "../components/HomeUser";

const Home = () => {
  const { profile } = useProfile();

  return (
    <div className="container mx-auto flex flex-col h-full justify-start">
      { (profile.accountId != '' ) ? <>
        { profile.accountType === 'doc' ? <HomeNutri /> : <HomeUser /> }
      </> : <Loading action="Se están cargando sus datos..." /> }
    </div>
  )
}

export default Home