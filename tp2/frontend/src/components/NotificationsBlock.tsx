import { useNotifications } from '../contexts/NotificationsContext'
import NotificationItem from './NotificationItem';

const NotificationsBlock = () => {
  const { notifications } = useNotifications();

  return (
    <>
    { notifications.length > 0 ? <div className="fixed w-96 top-16 right-2 z-40">
      {notifications.map((notification, index) => (
        <NotificationItem notification={notification} index={index} key={index} />
      ))}
      </div> : <></>
    }
    </>
  )
}

export default NotificationsBlock