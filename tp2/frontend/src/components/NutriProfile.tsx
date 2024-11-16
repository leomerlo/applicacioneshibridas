import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NutriLayout from "./NutriLayout"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import ProfileForm from "../views/ProfileForm";
import SubscriptionStatus from "./SubscriptionStatus";
import { useProfile } from "../contexts/ProfileContext";

const NutriProfile = () => {
  const menuOptions = [
    {
      name: 'profile',
      label: 'Perfil',
      clickHandler: () => {
        setTab('profile');
      },
      active: () => { return tab === 'profile' }
    },
    {
      name: 'subscription',
      label: 'Suscripción',
      clickHandler: () => {
        setTab('subscription');
      },
      active: () => { return tab === 'subscription' }
    }
  ];

  const [tab, setTab] = useState<"profile" | "subscription" | null>(null);

  useEffect(() => {
    setTab('profile');
  }, []);

  return (
    <NutriLayout
      sidebar={
        <ul className="flex-grow flex flex-col gap-4">
          { menuOptions.map((option, index) => (
            <li key={index}>
              <button className={['block', 'w-full', option.active() ? 'bg-gray-10' : null].join(" ")} onClick={option.clickHandler}>
                <div className="rounded-lg border p-4 flex justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-gray-80 font-bold">{option.label}</span>
                  </div>
                  <div className="grow flex justify-end items-center px-4 text-primary-main">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      }
      content={
        <>
          { tab === 'profile' ? <>
            <ProfileForm />
          </> : null }
          { tab === 'subscription' ? <>
            <SubscriptionStatus />
          </> : null }
        </>
      }
    />
  )
}

export default NutriProfile;