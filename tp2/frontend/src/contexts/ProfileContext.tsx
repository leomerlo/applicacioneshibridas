import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import accountService from "../services/account.service"
import { useNotifications } from "./NotificationsContext";
import { useNavigate } from 'react-router-dom';
import patientsService, { Patient } from "../services/patients.service";
import planService from "../services/plan.service";
import { Plan } from "./PlanContext";

export type Profile = {
  accountId?: string,
  diners: number,
  name: string,
  preferences?: string,
  restrictions?: string
  _id?: string,
  status: 'pending' | 'active' | 'inactive',
  accountType: 'doc' | 'user' | 'admin',
  idDocument?: string,
  idLicense?: string,
  password?: string
  docId?: string
}

export type Account = {
  _id: string,
  userName: string,
  password?: string
}

export const emptyProfile: {
  profile: Profile,
  refreshProfile: () => void,
  refreshPlans: () => void,
  refreshPatients: () => void,
  patients: Patient[],
  plans: Plan[],
  setCurrentPatient: (id: string) => void,
  patient: Patient,
  isUser: boolean
} = {
  profile: {
    accountId: '',
    diners: 0,
    name: '',
    _id: '',
    accountType: 'user',
    status: 'inactive'
  },
  refreshProfile: () => {},
  refreshPlans: () => {},
  refreshPatients: () => {},
  patients: [],
  plans: [],
  patient: {
    _id: '',
    name: '',
    plan: null,
    status: 'inactive',
    accountType: 'user',
    diners: 1
  },
  setCurrentPatient: (id: string) => {},
  isUser: false
}

const ProfileContext = createContext(emptyProfile)

function useProfile(){
  return useContext(ProfileContext)
}

function ProfileProvider({children}: PropsWithChildren){
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(emptyProfile.isUser);
  const [profile, setProfile] = useState<Profile>(emptyProfile.profile)
  const [patients, setPatients] = useState<Patient[]>(emptyProfile.patients);
  const [patient, setPatient] = useState<Patient>(emptyProfile.patient);
  const [plans, setPlans] = useState<Plan[]>([])
  const { updateNotifications } = useNotifications();

  useEffect(() => {
    refreshProfile();
    setIsUser(profile.accountType === 'user');
  }, [])

  const refreshProfile = async (): Promise<void> => {
    accountService.getSession()
    .then((profile) => {
      if (profile.status === 200) {
        setProfile(profile.data)

        if(profile.data.accountType === 'doc' && profile.data.status === 'active') {
          refreshPatients();
          refreshPlans();
        }
      } else {
        navigate('/login');
        updateNotifications({ variant: 'error', message: 'Hubo un error al recuperar el perfil.' });
      }
    })
    .catch((error) => {
      throw new Error(error);
    })
  }

  const refreshPlans = async (): Promise<void> => {
    return planService.getPlans()
    .then((resp) => {
      if (resp.status === 200) {
        setPlans(resp.data)
      } else {
        updateNotifications({ variant: 'error', message: 'Error al recuperar los planes.' });
      }
    }).catch((error: any) => {
      throw new Error(error);
    })
  }

  const refreshPatients = async (): Promise<void> => {
    patientsService.getPatients()
    .then((patients) => {
      if (patients.status === 200) {
        setPatients(patients.data)
      } else {
        updateNotifications({ variant: 'error', message: 'Error al recuperar los pacientes.' });
      }
    })
    .catch((error: any) => {
      throw new Error(error);
    });
  }

  const setCurrentPatient = (id: string) => {
    const currentPatient = patients?.find((patient) => patient._id === id);
    if(currentPatient) {
      setPatient(currentPatient);
    }
  }
  
  return (
    <ProfileContext.Provider value={{
      profile,
      refreshProfile,
      refreshPlans,
      refreshPatients,
      patients,
      plans,
      setCurrentPatient,
      patient,
      isUser
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export {
  useProfile,
  ProfileProvider
}