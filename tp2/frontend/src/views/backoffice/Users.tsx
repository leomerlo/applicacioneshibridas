import { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext'
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const Users = () => {
  const { users } = useAdmin();
  const [filteredList, setFilteredList] = useState(users)
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
        } else if (filters.type && filters.type === e.accountType) {
          return true;
        } else if (filters.name && filters.name === e.name) {
          return true;
        } else if (!filters.status && !filters.type && !filters.name) {
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
    const updatedFilters = {
      ...filters,
      status: filter
    }
    setFilters(updatedFilters);
  }

  function clearFilters(): void {
    setFilters({
      status: null,
      name: null,
      type: null
    })
  }

  return (
    <div className="container mx-auto h-full">
      <h1 className="text-4xl text-gray-80">Lista de usuarios</h1>
      <Link to="/admin/addUser">Agregar Usuario</Link>
      <span>Filtros: <Button onClick={() => { statusUpdate('pending')}}>Pendientes</Button> <Button onClick={clearFilters}>Clear</Button></span>
      <div className="flex-1">
        <ul>
          { filteredList.map((user: any) => (
            <li className="border-gray-80 bg-gray-20 my-3 rounded p-4" key={user.accountId}>
              <Link to={`/admin/user/${user._id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Users