import { useProfile } from "../contexts/ProfileContext"
import { Link, useNavigate, useParams } from "react-router-dom";
import NutriLayout from "../components/NutriLayout";
import PatientList from "../components/PatientList";
import Patient from "../components/Patient";
import { useEffect } from "react";
import Button from "../components/Button";

const Patients = () => {
  const { setCurrentPatient, patient, patients } = useProfile();
  const navigate = useNavigate();
  const { id } = useParams();

  const patientClickHandler = (id: string) => {
    navigate(`/patient/${id}`);
  }

  const addPatientHandler = () => {
    navigate('/addPatient');
  }

  useEffect(() => {
    setCurrentPatient(id as string);
  }, [patients, id]);
  
  return (
    <NutriLayout
      sidebar={
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <PatientList onClick={patientClickHandler} active={id}/>
          </div>
          <div>
            <Button onClick={addPatientHandler} full>Agregar paciente</Button>
          </div>
        </div>
      }
      content={
        <>
          { patients.length > 0 ? <>
              { patient._id === '' ? <>
                <div className="w-1/2 mx-auto mt-4 text-center">
                  <h1 className="text-2xl">Seleccioná un paciente para ver su información</h1>
                </div>
              </> : <>
                <Patient />
              </>}
            </> : <>
              <div className="flex flex-col justify-center w-1/2 items-center mx-auto mt-12">
                <h1 className="py-3 text-xl">No tenés pacientes asignados.</h1>
                <Button onClick={() => {navigate('/addPatient')}}>Agregá tu primer paciente</Button>
              </div>
            </>
          }
        </>
      }
    />
  )
}

export default Patients