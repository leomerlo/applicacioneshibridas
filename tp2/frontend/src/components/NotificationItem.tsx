import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Notification, useNotifications } from '../contexts/NotificationsContext';

export type Props = {
  notification: Notification,
  index: number
}

const NotificationItem = (props: Props) => {
  const { closeNotification } = useNotifications();

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 mb-2 flex justify-between" key={props.index}>
      <span>{ props.notification.message }</span>
      <button onClick={() => { closeNotification(props.notification) }}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  )
}

export default NotificationItem