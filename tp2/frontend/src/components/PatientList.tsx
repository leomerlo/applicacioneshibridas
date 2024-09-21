import { useProfile } from "../contexts/ProfileContext"
import { Patient } from "../services/patients.service";
import PatientCard from "./PatientCard";

export type PatientListProps = {
  onClick: (planId: string) => void,
  patientName?: string
}

const PatientList = (props: PatientListProps) => {
  const { patients } = useProfile();
  
  const clickHandler = (id: string) => {
    props.onClick(id);
  }
  
  return (
    <>
      <h2 className="text-xl mb-5">Mis pacientes</h2>
      <ul className="flex-grow">
        { patients.map((patient: Patient) => (
          <li key={patient._id}>
            <PatientCard patient={patient} onClick={clickHandler} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default PatientList