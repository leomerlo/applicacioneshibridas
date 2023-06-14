import { Outlet } from 'react-router-dom'
import './App.scss'
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <div className="pt-navbar p-5 w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default App
