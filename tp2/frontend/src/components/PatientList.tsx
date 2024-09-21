import { useProfile } from "../contexts/ProfileContext"
import { Patient } from "../services/patients.service";
import PatientCard from "./PatientCard";

const PatientList = (props: {
  onClick: (id: string) => void
}) => {
  const { patients } = useProfile();
  
  const clickHandler = (id: string) => {
    props.onClick(id);
  }
  
  return (
    <>
      <h2>Mis Pacientes</h2>
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