import React, { useEffect, useState } from 'react'
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import UserCard from './UserCard';
import Button from './Button';

export type Props = {
  active?: string
}

const UserSidebar = (props: Props) => {
  const { users } = useAdmin();
  const [filteredList, setFilteredList] = useState(users)
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    status: null | string,
    type: null | string,
    name: null | string
  }>({
    status: null,
    type: "",
    name: null,
  });

  const isActive = (id: string) => {
    if (props.active === id) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (users.length > 0) {
      const filteredUsers = users.filter((e) => {
        if (filters.status && filters.status === e.status) {
          return true;
        }

        if (
          filters.type &&
          filters.type === "patient" &&
          e.accountType === "user" &&
          e.docId
        ) {
          return true;
        }
        
        if (
          filters.type &&
          filters.type === "planner" &&
          e.accountType === "user" &&
          !e.docId
        ) {
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

  function selectUser(id: string): void {
    navigate(`/admin/user/${id}`);
  }

  function filterTypeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    typeUpdate(event.target.value);
  }
  
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl mb-5">Usuarios</h2>
        <div className="mb-4">
          <Input onInput={nameUpdate} name="filter-name" value={filters.name as string} label="Buscar por nombre" srOnly placeholder="Buscar por nombre"></Input> 
        </div>
        <div>
          <div className="mb-4 flex gap-4 items-center">
            <label htmlFor="user-filter">Filtro</label>
            <select id="user-filter" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" name="filter" onChange={filterTypeHandler}>
              <option value="doc" selected={filters.type === "doc"}>Nutricionistas</option>
              <option value="patient" selected={filters.type === "patient"}>Pacientes</option>
              <option value="planner" selected={filters.type === "user"}>Planner</option>
              <option value="admin" selected={filters.type === "admin"}>Administradores</option>
              <option value="" selected={filters.type === ""}>Todos</option>
            </select>
          </div>
        </div>
        <ul className="flex-grow flex flex-col gap-4">
          { filteredList.map((user: any) => (
            <li key={user.accountId}>
              <UserCard active={isActive(user._id)} user={user} onClick={selectUser} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Button full className="mt-4" onClick={
          () => {
            navigate("/admin/addUser")
          }
        }>
          Agregar Usuario
        </Button>
      </div>
    </div>
  )
}

export default UserSidebar