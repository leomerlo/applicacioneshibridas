import { createContext, useState, PropsWithChildren, useContext } from "react"

export type Notification = {
  variant: 'success' | 'info' | 'warning' | 'error',
  message: string,
}

const initialNotifications: {
  notifications: Notification[],
  updateNotifications: (notification: Notification) => void,
  closeNotification: (notification: Notification) => void
} = {
  notifications: [],
  updateNotifications: () => {},
  closeNotification: () => {}
}

const NotificationsContext = createContext(initialNotifications)

function useNotifications(){
  return useContext(NotificationsContext)
}

function NotificationsProvider({children}: PropsWithChildren){
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications.notifications)

  const updateNotifications = (notification: Notification) => {
    setNotifications([...notifications, notification]);
    setTimeout(() => {
      closeNotification(notification);
    }, 5000);
  }

  const closeNotification = (notification: Notification) => {
    const filter = notifications.filter((n) => n !== notification);
    setNotifications(filter);
  }
  
  return (
    <NotificationsContext.Provider value={{ notifications, updateNotifications, closeNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export {
  useNotifications,
  NotificationsProvider
}