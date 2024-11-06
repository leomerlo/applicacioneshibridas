import { Outlet } from 'react-router-dom'
import { ProfileProvider } from '../../contexts/ProfileContext';
import NotificationsBlock from '../../components/NotificationsBlock';
import NavBar from '../../components/NavBar';

function BackOffice() {
  return (
    <ProfileProvider>
      <div className="flex flex-col min-h-screen">
        <NotificationsBlock />
        <NavBar />
        <div className="flex-1 w-full flex">
          <Outlet />
        </div>
      </div>
    </ProfileProvider>
  )
}

export default BackOffice
