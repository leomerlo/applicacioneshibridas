import { Plan } from "../contexts/PlanContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export interface PlanCardProps {
  plan: Plan,
  onClick: (planId: string) => void
}

const PlanCard = (props: PlanCardProps) => {
  return (
    <button className="block w-full mb-3" onClick={() => { props.onClick(props.plan._id as string) }} aria-label={`Seleccionar plan ${props.plan.title}`}>
      <div className="bg-white rounded-lg border-gray-20 border p-4 flex justify-between">
        <div>
          <span className="text-gray-80 font-bold">{props.plan.title ? props.plan.title : props.plan.meta.title}</span>
          { props.plan.meta && props.plan.meta.status == "draft" ? <span className="ms-4 text-gray-60">Borrador</span> : ''}
        </div>
        <div className="grow flex justify-end items-center px-4 text-primary-main">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    </button>
  )
}

export default PlanCard