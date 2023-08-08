import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Notification, useNotifications } from '../contexts/NotificationsContext';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export type Props = {
  notification: Notification,
  index: number
}

const NotificationItem = (props: Props) => {
  const { closeNotification } = useNotifications();

  const notificationStatusColor = props.notification.variant === "success" ? "text-green-500" : "text-red-500";
  const notificationIcon = props.notification.variant === "success" ? faCheckCircle : faTimesCircle;

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 mb-2 flex justify-between" key={props.index}>
      <span className={`${notificationStatusColor} me-4`}>
        <FontAwesomeIcon icon={notificationIcon} />
      </span>
      <span className="flex-grow">{ props.notification.message }</span>
      <button onClick={() => { closeNotification(props.notification) }}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  )
}

export default NotificationItem