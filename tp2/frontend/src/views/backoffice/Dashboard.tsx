import { useProfile } from "../../contexts/ProfileContext";
import GradientCard from "../../components/GradientCard";
import { useEffect, useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
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
        // @ts-ignore
        users,
        docs: docs.length,
        // @ts-ignore
        awaiting
      });
    }
  }, [users]);

  return (
    <div className="container mx-auto h-full">
      <h1 className="text-4xl text-gray-80">Bienvenid@, {profile.name}</h1>
      <div className="flex flex-col md:flex-row gap-6 my-6">
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
      <div className="flex flex-col md:flex-row my-6 gap-6">
        <div className="flex-1">
          <h2 className="text-2xl text-gray-80">Últimos usuarios</h2>
          <ul>
            { dashboard.users.slice(-5).map((user: any) => (
              <li className="border-gray-80 bg-gray-20 my-3 rounded p-4" key={user.accountId}>
                <Link className="block" to={`/admin/user/${user._id}`}>{user.name}</Link>
              </li>
            ))}
          </ul>
          <Button className="ml-auto" onClick={
            () => {
              navigate("/admin/users");
            }
          }>Ver todos</Button>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl text-gray-80">En espera de aprobación</h2>
          { dashboard.awaiting.length > 0 ? <>
          <ul>
            { dashboard.awaiting.reverse().map((user: any) => (
              <li className="border-gray-80 bg-gray-20 my-3 rounded p-4" key={user.accountId}>
                <Link className="block" to={`/admin/user/${user._id}`}>{user.name}</Link>
              </li>
            )) }
          </ul>
          </> : <p className="text-gray-80 my-4">No hay nutricionistas esperando aprobación.</p> }
        </div>
      </div>
    </div>
  )
}

export default Dashboard