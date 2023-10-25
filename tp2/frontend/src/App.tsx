import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';
import { ProfileProvider } from './contexts/ProfileContext';
import { PlanProvider } from './contexts/PlanContext';
import NotificationsBlock from './components/NotificationsBlock';

function App() {

  return (
    <PlanProvider>
    <ProfileProvider>
      <div className="flex min-h-screen">
        <NotificationsBlock />
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
