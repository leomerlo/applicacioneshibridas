import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';
import { ProfileProvider } from './contexts/ProfileContext';

function App() {
  return (
    <ProfileProvider>
      <div className="flex min-h-screen">
        <NavBar />
        <div className="pt-navbar p-5 w-full">
          <Outlet />
        </div>
      </div>
    </ProfileProvider>
  )
}

export default App
