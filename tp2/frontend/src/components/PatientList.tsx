import { useEffect, useState } from "react";
import { useProfile } from "../contexts/ProfileContext"
import { Patient } from "../services/patients.service";
import Input from "./Input";
import PatientCard from "./PatientCard";

export type PatientListProps = {
  onClick: (planId: string) => void,
  patientName?: string,
  active?: string
}

const PatientList = (props: PatientListProps) => {
  const { patients } = useProfile();
  const [patientFilter, setPatientFilter] = useState("");
  const [filteredList, setFilteredList] = useState<Patient[]>([]);
  
  const clickHandler = (id: string) => {
    props.onClick(id);
  }

  const isActive = (id: string) => {
    if (props.active === id) {
      return true;
    }
    return false;
  }

  const patientFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientFilter(e.target.value);
  }

  useEffect(() => {
    if (patientFilter === "") {
      setFilteredList(patients);
    } else {
      setFilteredList(patients.filter((patient: Patient) => patient.name.toLowerCase().includes(patientFilter.toLowerCase())));
    }
  }, [patientFilter]);

  useEffect(() => {
    setFilteredList(patients);
  }, [patients]);
  
  return (
    <>
      <h2 className="text-xl mb-5">Mis pacientes</h2>
      <div className="mb-4">
        <Input placeholder="Buscar paciente" value={patientFilter} onInput={patientFilterHandler} name="patient-filter" label="Filtrar pacientes" srOnly />
      </div>
      { filteredList.length === 0 ? <p className="p-4">No hay pacientes disponibles con ese nombre</p> : <>
        <ul className="flex-grow flex flex-col gap-4">
          { filteredList.map((patient: Patient) => (
            <li key={patient._id}>
              <PatientCard patient={patient} onClick={clickHandler} active={isActive(patient._id as string)} />
            </li>
          ))}
        </ul>
      </>}
    </>
  )
}

export default PatientList