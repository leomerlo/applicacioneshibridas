import ProfileForm from "../views/ProfileForm";
import { useProfile } from "../contexts/ProfileContext";
import { usePlan } from "../contexts/PlanContext";

const UserProfile = () => {
  const { profile } = useProfile();
  const { plan } = usePlan();

  return (
    <div className="container-fluid w-full md:w-mobile mx-auto my-12">
      <div className="px-6 flex flex-col gap-8">
        <ProfileForm />
        { profile.docId && (
          <div>
            <h2 className="text-2xl mb-4">Sobre mi plan</h2>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex">
                <div className="w-1/2">A cargo de:</div>
                <div className="w-1/2"><strong>{ profile?.doctor }</strong></div>
              </div>
              <div className="flex">
                <div className="w-1/2">Restricciones:</div>
                <div className="w-1/2"><strong>{ plan?.meta.restrictions }</strong></div>
              </div>
              <div className="flex">
                <div className="w-1/2">Preferencias:</div>
                <div className="w-1/2"><strong>{ plan?.meta.preferences }</strong></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile