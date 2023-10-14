import { Patient } from "../services/patients.service"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { Link } from "react-router-dom"

export interface PatientCardProps {
  patient: Patient
}

const PatientCard = (props: PatientCardProps) => {
  return (
    <div className="bg-white rounded-lg border-gray-20 border p-4 mb-3 flex justify-between">
      <Link to={`/patient/${props.patient._id}`} className="flex-grow flex">
        <div className="flex flex-col">
          <span className="text-gray-80 font-bold">{props.patient.name}</span>
          <span className="text-sm text-gray-60 font-bold">
            { props.patient.plan ? <>
              <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
              Plan asignado
            </> : <>
              <FontAwesomeIcon icon={faCircleXmark} className="me-2" />
              Sin plan asignado
            </>}
          </span>
        </div>
        <div className="grow flex justify-end items-center px-4 text-primary-main">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </Link>
    </div>
  )
}

export default PatientCard