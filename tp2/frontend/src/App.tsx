import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';
import { ProfileProvider } from './contexts/ProfileContext';
import { PlanProvider } from './contexts/PlanContext';
import { useNotifications } from './contexts/NotificationsContext';
import NotificationItem from './components/NotificationItem';

function App() {
  const { notifications } = useNotifications();

  return (
    <PlanProvider>
    <ProfileProvider>
      <div className="flex min-h-screen">
        { notifications.length > 0 ? <div className="fixed top-16 container left-1/2 -translate-x-1/2 z-40">
          {notifications.map((notification, index) => (
            <NotificationItem notification={notification} index={index} key={index} />
          ))}
          </div> : <></>
        }
        <NavBar />
        <div className="pt-navbar p-5 w-full z-10">
          <Outlet />
        </div>
      </div>
    </ProfileProvider>
    </PlanProvider>
  )
}

export default App
