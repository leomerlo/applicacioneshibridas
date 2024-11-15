import ProfileForm from "./ProfileForm";
import { useProfile } from "../contexts/ProfileContext";
import NutriProfile from "../components/NutriProfile";

const _Profile = () => {
  const { profile } = useProfile();

  return (
    profile.accountType === 'doc' ? (
      <NutriProfile />
    ) : (
      <div className="container-fluid w-full md:w-mobile mx-auto my-12">
        <div className="px-6">
          <ProfileForm />
        </div>
      </div>
    )
  )
}

export default _Profile