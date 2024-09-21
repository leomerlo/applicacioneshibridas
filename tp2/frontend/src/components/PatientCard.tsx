import { Patient } from "../services/patients.service"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { Link } from "react-router-dom"
import Button from "./Button"

export interface PatientCardProps {
  patient: Patient,
  onClick: (id: string) => void
}

const PatientCard = (props: PatientCardProps) => {

  const clickHandler = () => {
    props.onClick(props.patient._id as string);
  }

  return (
    <Button full variant="tertiary" className="flex-grow flex" onClick={clickHandler}>
      <div className="flex flex-col text-left">
        <span className="text-gray-80 font-bold">{props.patient.name}</span>
        <span className="text-sm text-gray-60 font-bold">
          { props.patient.plan ? <>
            <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
            Plan asignado
          </> : <>
            <FontAwesomeIcon icon={faCircleXmark} className="me-2" />
            Plan no asignado
          </>}
        </span>
      </div>
    </Button>
  )
}

export default PatientCard