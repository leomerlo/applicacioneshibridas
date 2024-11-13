import NutriLayout from '../../components/NutriLayout';
import UserSidebar from '../../components/UserSidebar';
import Dashboard from '../../components/Dashboard';

const Users = () => {
  
  return (
    <NutriLayout
      sidebar={<>
        <UserSidebar />
      </>}
      content={
        <Dashboard />
      }
    />
  )
}

export default Users