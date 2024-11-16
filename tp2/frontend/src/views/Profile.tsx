import { useProfile } from "../contexts/ProfileContext";
import NutriProfile from "../components/NutriProfile";
import UserProfile from "../components/UserProfile";

const Profile = () => {
  const { profile } = useProfile();

  return (
    profile.accountType === 'doc' ? (
      <NutriProfile />
    ) : (
      <UserProfile />
    )
  )
}

export default Profile