import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import accountService from "../services/account.service"

export type Profile = {
  accountId?: string,
  diners: number,
  name: string,
  preferences?: string,
  restrictions?: string
  _id?: string
}

const emptyProfile: {
  profile: Profile,
  refreshProfile: () => void
} = {
  profile: {
    accountId: '',
    diners: 0,
    name: '',
    _id: ''
  },
  refreshProfile: () => {}
}

const ProfileContext = createContext(emptyProfile)

function useProfile(){
  return useContext(ProfileContext)
}

function ProfileProvider({children}: PropsWithChildren){
  const [profile, setProfile] = useState<Profile>(emptyProfile.profile)

  useEffect(() => {
    refreshProfile();
  }, [])

  const refreshProfile = () => {
    accountService.getSession()
    .then((profile) => {
      setProfile(profile.data)
    })
  }
  
  return (
    <ProfileContext.Provider value={{profile, refreshProfile}}>
      {children}
    </ProfileContext.Provider>
  )
}

export {
  useProfile,
  ProfileProvider
}