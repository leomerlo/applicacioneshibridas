import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';
import NotificationsBlock from './components/NotificationsBlock';
import { useProfile } from './contexts/ProfileContext';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NotificationsBlock />
      <NavBar />
      <div className="flex-1 w-full flex">
        <Outlet />
      </div>
    </div>
  )
}

export default App
