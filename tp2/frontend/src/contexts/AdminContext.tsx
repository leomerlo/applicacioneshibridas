import { createContext, useState, PropsWithChildren, useContext, useEffect } from "react"
import { Profile } from "./ProfileContext"
import backofficeService from "../services/backoffice.service"
import { useNotifications } from "./NotificationsContext"

const initialAdmin: {
  users: Profile[],
} = {
  users: [],
}

const AdminContext = createContext(initialAdmin)

function useAdmin(){
  return useContext(AdminContext)
}

function AdminProvider({children}: PropsWithChildren){
  const { updateNotifications } = useNotifications();
  const [users, setUsers] = useState<Profile[]>(initialAdmin.users)

  useEffect(() => {
    backofficeService.getDashboard().then((response) => {
      if(response.status === 200) {
        setUsers(response.data.users);
      } else {
        updateNotifications({
          variant: "error",
          message: "No se pudo cargar los usuarios."
        })
      }
    });
  }, []);
  
  return (
    <AdminContext.Provider value={{ users }}>
      {children}
    </AdminContext.Provider>
  )
}

export {
  useAdmin,
  AdminProvider
}