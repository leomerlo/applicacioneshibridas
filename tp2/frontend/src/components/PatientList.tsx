import { useProfile } from "../contexts/ProfileContext"
import { Patient } from "../services/patients.service";
import PatientCard from "./PatientCard";

const PatientList = () => {
  const { patients } = useProfile();
  
  return (
    <div className="patient-list h-full flex flex-col overflow-y-auto">
      <p className="mb-8">Estos son tus pacientes. Ingresando a cada uno puedes  editar su información y el plan de alimentación.</p>
      <ul className="flex-grow">
        { patients.map((patient: Patient) => (
        <li key={patient._id}>
          <PatientCard patient={patient} />
        </li>
        ))}
      </ul>
    </div>
  )
}

export default PatientList