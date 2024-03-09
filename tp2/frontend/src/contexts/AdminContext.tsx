import { createContext, useState, PropsWithChildren, useContext, useEffect } from "react"
import { Profile } from "./ProfileContext"
import backofficeService from "../services/backoffice.service"
import { useNotifications } from "./NotificationsContext"

const initialAdmin: {
  users: Profile[],
  updateUsers: () => void
} = {
  users: [],
  updateUsers: () => {}
}

const AdminContext = createContext(initialAdmin)

function useAdmin(){
  return useContext(AdminContext)
}

function AdminProvider({children}: PropsWithChildren){
  const { updateNotifications } = useNotifications();
  const [users, setUsers] = useState<Profile[]>(initialAdmin.users)

  useEffect(() => {
    updateUsers();
  }, []);

  async function updateUsers() {
    const response = await backofficeService.getDashboard()
    if(response.status === 200) {
      setUsers(response.data.users);
    } else {
      updateNotifications({
        variant: "error",
        message: "No se pudieron cargar los usuarios."
      })
    }
  }
  
  return (
    <AdminContext.Provider value={{ users, updateUsers }}>
      {children}
    </AdminContext.Provider>
  )
}

export {
  useAdmin,
  AdminProvider
}