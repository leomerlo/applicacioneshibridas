import { useProfile } from "../contexts/ProfileContext"
import { Patient } from "../services/patients.service";
import PatientCard from "./PatientCard";

export type PatientListProps = {
  onClick: (planId: string) => void,
  patientName?: string,
  active?: string
}

const PatientList = (props: PatientListProps) => {
  const { patients } = useProfile();
  
  const clickHandler = (id: string) => {
    props.onClick(id);
  }

  const isActive = (id: string) => {
    console.log(props.active, id);
    if (props.active === id) {
      return true;
    }
    return false;
  }
  
  return (
    <>
      <h2 className="text-xl mb-5">Mis pacientes</h2>
      <ul className="flex-grow flex flex-col gap-4">
        { patients.map((patient: Patient) => (
          <li key={patient._id}>
            <PatientCard patient={patient} onClick={clickHandler} active={isActive(patient._id as string)} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default PatientList