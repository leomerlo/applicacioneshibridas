import { createContext, useState, PropsWithChildren, useContext } from "react"

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