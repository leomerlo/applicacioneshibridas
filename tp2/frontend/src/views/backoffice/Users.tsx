import { useNavigate } from 'react-router-dom';
import GoBack from '../../components/GoBack';
import NutriLayout from '../../components/NutriLayout';
import UserSidebar from './UserSidebar';

const Users = () => {
  const navigate = useNavigate();
  
  return (
    <NutriLayout
      sidebar={<>
        <UserSidebar />
      </>}
      content={
        <div className="container-fluid mx-auto h-full">
          <div className="flex flex-col h-full pb-20 gap-6">
            <div>
              <GoBack />
            </div>
            <h1 className="text-4xl text-gray-80">Lista de usuarios</h1>
          </div>
        </div>
      }
    />
  )
}

export default Users