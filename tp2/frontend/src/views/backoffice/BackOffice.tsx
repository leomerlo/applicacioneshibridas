import { Outlet } from 'react-router-dom'
import { ProfileProvider } from '../../contexts/ProfileContext';
import NotificationsBlock from '../../components/NotificationsBlock';
import NavBar from '../../components/NavBar';

function BackOffice() {
  return (
    <ProfileProvider>
      <div className="flex min-h-screen">
        <NotificationsBlock />
        <NavBar />
        <div className="pt-navbar p-5 w-full z-10">
          <Outlet />
        </div>
      </div>
    </ProfileProvider>
  )
}

export default BackOffice
