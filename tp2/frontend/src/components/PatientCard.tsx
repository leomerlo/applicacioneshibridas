import { Patient } from "../services/patients.service"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { Link } from "react-router-dom"
import Button from "./Button"

export interface PatientCardProps {
  patient: Patient,
  onClick: (id: string) => void,
  active?: boolean
}

const PatientCard = (props: PatientCardProps) => {

  const clickHandler = () => {
    props.onClick(props.patient._id as string);
  }

  const setClasses = () => {
    let classes = 'rounded-lg border p-4 flex justify-between';
    if (props.active === true) {
      classes += ' border-primary-main bg-white';
    } else {
      classes += ' border-gray-40';
    }
    return classes;
  }

  return (
    <button className="block w-full" onClick={clickHandler}>
      <div className={setClasses()}>
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
        <div className="grow flex justify-end items-center px-4 text-primary-main">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    </button>
  )
}

export default PatientCard