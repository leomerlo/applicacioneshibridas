import { useProfile } from "../../contexts/ProfileContext";
import GradientCard from "../../components/GradientCard";
import { useEffect, useState } from "react";
import backofficeService from "../../services/backoffice.service";

const Dashboard = () => {
  const { profile } = useProfile();
  const [dashboard, setDashboard] = useState({
    docs: 0,
    awaiting: [],
    plans: 0,
    users: []
  })

  useEffect(() => {
    backofficeService.getDashboard().then((response) => {
      if (response.status === 200) {
        setDashboard(response.data);
      }
    }); 
  }, []);

  return (
    <div className="container mx-auto h-full">
      <h1 className="text-4xl text-gray-80">Bienvenido, {profile.name}</h1>
      <div className="flex gap-6 my-6">
        <GradientCard title="Usuarios totales">
          <span className="text-6xl text-white">{dashboard.users.length}</span>
        </GradientCard>
        <GradientCard title="Nutricionistas">
          <span className="text-6xl text-white">{dashboard.docs}</span>
        </GradientCard>
        <GradientCard title="Esperando aprobación">
          <span className="text-6xl text-white">{dashboard.awaiting.length}</span>
        </GradientCard>
        <GradientCard title="Planes generados">
          <span className="text-6xl text-white">{dashboard.plans}</span>
        </GradientCard>
      </div>
      <div className="my-6 flex">
        <div className="flex-1">
          <h2 className="text-2xl text-gray-80">Últimos usuarios</h2>
          <ul>
            { dashboard.users.reverse().map((user: any) => (
              <li key={user.accountId}>{user.name}</li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl text-gray-80">Esperando aprobación</h2>
          <ul>
            { dashboard.awaiting.reverse().map((user: any) => (
              <li key={user.accountId}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard