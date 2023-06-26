import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';
import { ProfileProvider } from './contexts/ProfileContext';
import { PlanProvider } from './contexts/PlanContext';
import { useNotifications } from './contexts/NotificationsContext';

function App() {
  const { notifications } = useNotifications();

  return (
    <PlanProvider>
    <ProfileProvider>
      <div className="flex min-h-screen">
        { notifications.length > 0 ? <div className="absolute top-0 right-0 m-5 z-40">
          {notifications.map((notification, index) => (
            <div className="bg-white rounded-lg shadow-lg p-5 mb-2" key={index}>
              <span>{ notification.message }</span>
            </div>
          ))}
          </div> : <></>
        }
        <NavBar />
        <div className="pt-navbar p-5 w-full">
          <Outlet />
        </div>
      </div>
    </ProfileProvider>
    </PlanProvider>
  )
}

export default App
