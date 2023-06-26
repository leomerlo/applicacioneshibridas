import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import accountService from "../services/account.service"

export type Notification = {
  variant: 'success' | 'info' | 'warning' | 'error',
  message: string,
}

const initialNotifications: {
  notifications: Notification[],
  updateNotifications: (notification: Notification) => void
} = {
  notifications: [],
  updateNotifications: () => {}
}

const NotificationsContext = createContext(initialNotifications)

function useNotifications(){
  return useContext(NotificationsContext)
}

function NotificationsProvider({children}: PropsWithChildren){
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications.notifications)

  const updateNotifications = (notification: Notification) => {
    setNotifications([...notifications, notification]);
  }
  
  return (
    <NotificationsContext.Provider value={{ notifications, updateNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export {
  useNotifications,
  NotificationsProvider
}