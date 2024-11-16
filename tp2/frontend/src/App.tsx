import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';
import NotificationsBlock from './components/NotificationsBlock';
import NavBarMobile from './components/NavBarMobile';

function App() {
  return (
    <div className="flex flex-col min-h-screen max-h-screen md:max-h-none">
      <NotificationsBlock />
      <NavBar />
      <div className="flex-1 w-full flex overflow-y-auto">
        <Outlet />
      </div>
      <div className="md:hidden">
        <NavBarMobile />
      </div>
    </div>
  )
}

export default App
