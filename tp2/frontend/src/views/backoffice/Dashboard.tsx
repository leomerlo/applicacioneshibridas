import { useProfile } from "../../contexts/ProfileContext";
import GradientCard from "../../components/GradientCard";

const Dashboard = () => {
  const { profile } = useProfile();
  return (
    <div className="container mx-auto h-full">
      <h1 className="text-4xl text-gray-80">Bienvenido, {profile.name}</h1>
      <div className="flex gap-6 my-6">
        <GradientCard title="Usuarios totales">
          <span className="text-6xl text-white">250</span>
        </GradientCard>
        <GradientCard title="Nutricionistas">
          <span className="text-6xl text-white">250</span>
        </GradientCard>
        <GradientCard title="Esperando aprobación">
          <span className="text-6xl text-white">250</span>
        </GradientCard>
        <GradientCard title="Planes generados">
          <span className="text-6xl text-white">250</span>
        </GradientCard>
      </div>
      <div className="my-6">
        <h2 className="text-2xl text-gray-80">Últimos usuarios</h2>
      </div>
    </div>
  )
}

export default Dashboard