import { useProfile } from "../contexts/ProfileContext"
import { Link, Navigate, useNavigate } from "react-router-dom";
import NutriLayout from "../components/NutriLayout";
import PatientList from "../components/PatientList";
import Patient from "../components/Patient";
import { useState } from "react";
import Button from "../components/Button";

const Patients = () => {
  const { patients } = useProfile();
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  const patientClickHandler = (id: string) => {
    setSelectedPatient(id as string);
  }

  const addPatientHandler = () => {
    navigate('/addPatient');
  }
  
  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <PatientList onClick={patientClickHandler}/>
          </div>
          <div>
            <Button onClick={addPatientHandler} full>Agregar paciente</Button>
          </div>
        </div>
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