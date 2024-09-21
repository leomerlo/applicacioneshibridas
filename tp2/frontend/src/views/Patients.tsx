import { useProfile } from "../contexts/ProfileContext"
import { Link } from "react-router-dom";
import NutriLayout from "../components/NutriLayout";
import PatientList from "../components/PatientList";
import Patient from "../components/Patient";
import { useState } from "react";

const Patients = () => {
  const { patients } = useProfile();

  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  const patientClickHandler = (id: string) => {
    setSelectedPatient(id as string);
  }
  
  return (
    <NutriLayout
      sidebar={
        <PatientList onClick={patientClickHandler}/>
      }
      content={
        <>
          { patients.length > 0 ? <>
              { !selectedPatient ? <>
                <h1 className="text-2xl">Seleccioná un paciente para ver su información</h1>
              </> : <>
                <Patient id={selectedPatient} />
              </>}
            </> : <>
              <h1 className="py-3 text-xl">No tenés pacientes asignados.</h1>
              <h2 className="py-3 text-lg"><Link className="underline" to={'/addPatient'}>Agregá tu primer paciente</Link></h2>
            </>
          }
        </>
      }
    />
  )
}

export default Patients