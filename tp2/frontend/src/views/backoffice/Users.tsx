import { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext'
import Button from '../../components/Button';
import GoBack from '../../components/GoBack';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';

const Users = () => {
  const { users } = useAdmin();
  const [filteredList, setFilteredList] = useState(users)
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    status: null | string,
    type: null | string,
    name: null | string
  }>({
    status: null,
    type: null,
    name: null,
  });

  useEffect(() => {
    if (users.length > 0) {
      const filteredUsers = users.filter((e) => {
        if (filters.status && filters.status === e.status) {
          return true;
        }
        
        if (filters.type && filters.type === e.accountType) {
          return true;
        }
        
        if (filters.name && e.name.indexOf(filters.name) > -1) {
          return true;
        }
        
        if (!filters.status && !filters.type && !filters.name) {
          return true;
        }

        return false;
      });

      setFilteredList(filteredUsers);
    }
  }, [filters]);

  useEffect(() => {
    clearFilters();
  }, [users]);

  function statusUpdate(filter: string): void {
    if (filters.status === filter) {
      setFilters({
        ...filters,
        status: null
      });
    } else {
      setFilters({
        ...filters,
        status: filter
      });
    }
  }

  function typeUpdate(filter: string): void {
    if(filters.type === filter) {
      setFilters({
        ...filters,
        type: null
      });
    } else {
      setFilters({
        ...filters,
        type: filter
      });
    }
  }

  const nameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      name: event.target.value
    });
  };

  function clearFilters(): void {
    setFilters({
      status: null,
      name: null,
      type: null
    })
  }

  return (
    <div className="container mx-auto h-full">
      <div className="mb-4">
        <GoBack />
      </div>
      <h1 className="text-4xl text-gray-80">Lista de usuarios</h1>
      <Button className="mt-4" onClick={
        () => {
          navigate("/admin/addUser")
        }
      }>
        Agregar Usuario
      </Button>
      <div className="my-4">
        <span>Filtros:</span>
      </div>
      <div className="flex gap-3 mb-4">
        <Button onClick={() => { statusUpdate('pending')}} variant={ filters.status === 'pending' ? 'primary' : 'secondary'}>Pendientes</Button>
        <Button onClick={() => { statusUpdate('inactive')}} variant={ filters.status === 'inactive' ? 'primary' : 'secondary'}>Inactivos</Button>
        <Button onClick={() => { typeUpdate('doc')}} variant={ filters.type === 'doc' ? 'primary' : 'secondary'}>Nutricionistas</Button>
        <Button onClick={clearFilters} className="ml-auto">Limpiar Filtros</Button>
      </div>
      <div className="my-4">
        <Input onInput={nameUpdate} name="filter-name" value={filters.name as string} label="Buscar por nombre"></Input> 
      </div>
      <div className="flex-1">
        <ul>
          { filteredList.map((user: any) => (
            <li className="border-gray-80 bg-gray-20 my-3 rounded p-4" key={user.accountId}>
              <Link className="block" to={`/admin/user/${user._id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Users