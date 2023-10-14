import { useNotifications } from '../contexts/NotificationsContext'
import NotificationItem from './NotificationItem';

const NotificationsBlock = () => {
  const { notifications } = useNotifications();

  return (
    <>
    { notifications.length > 0 ? <div className="fixed top-16 container left-1/2 -translate-x-1/2 z-40">
      {notifications.map((notification, index) => (
        <NotificationItem notification={notification} index={index} key={index} />
      ))}
      </div> : <></>
    }
    </>
  )
}

export default NotificationsBlock