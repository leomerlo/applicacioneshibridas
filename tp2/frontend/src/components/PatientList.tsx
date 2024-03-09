import { useProfile } from "../contexts/ProfileContext"
import { Patient } from "../services/patients.service";
import PatientCard from "./PatientCard";

const PatientList = () => {
  const { profile, patients } = useProfile();
  
  return (
    <div className="patient-list h-full flex flex-col overflow-y-auto">
      <div>
        <h1 className="text-4xl mt-6 mb-2 text-left">Hola, <span className="text-primary-main font-bold">{ profile.name }</span></h1>
        <p className="mb-8">Estos son tus pacientes. Al ingresar a cada uno, podés editar su información y el plan de alimentación.</p>
      </div>
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