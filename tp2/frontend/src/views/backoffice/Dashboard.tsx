import { useProfile } from "../../contexts/ProfileContext";
import GradientCard from "../../components/GradientCard";
import { useEffect, useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";

const Dashboard = () => {
  const { profile } = useProfile();
  const { users } = useAdmin();
  const [dashboard, setDashboard] = useState({
    docs: 0,
    awaiting: [],
    users: []
  })

  useEffect(() => {
    if(users.length > 0) {
      const awaiting = users.filter((e) => { return e.status === "pending" });
      const docs = users.filter((e) => { return e.accountType === "doc" });
      setDashboard({
        users,
        docs: docs.length,
        awaiting
      });
    }
  }, [users]);

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
      </div>
      <div className="my-6 flex gap-6">
        <div className="flex-1">
          <h2 className="text-2xl text-gray-80">Últimos usuarios</h2>
          <ul>
            { dashboard.users.splice(-5).map((user: any) => (
              <li className="border-gray-80 bg-gray-20 my-3 rounded p-4" key={user.accountId}>{user.name}</li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl text-gray-80">Esperando aprobación</h2>
          <ul>
            { dashboard.awaiting.reverse().map((user: any) => (
              <li className="border-gray-80 bg-gray-20 my-3 rounded p-4" key={user.accountId}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard