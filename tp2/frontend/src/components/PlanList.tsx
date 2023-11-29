import { useProfile } from "../contexts/ProfileContext"
import { Plan } from "../contexts/PlanContext";
import PlanCard from "./PlanCard";

export type PlanListProps = {
  onPlanClick: (planId: string) => void,
  patientName?: string
}

const PlanList = (props: PlanListProps) => {
  const { plans } = useProfile();
  
  return (
    <div className="patient-list h-full flex flex-col overflow-y-auto">
      { props.patientName ? <p className="mb-8">
        Seleccioná un plan para asignarlo al paciente { props.patientName }.
      </p> : <p className="mb-8"></p>}
      
      <ul className="flex-grow">
        { plans.map((plan: Plan) => (
        <li key={plan._id}>
          <PlanCard plan={plan} onClick={(planId: string) => { props.onPlanClick(planId) }}/>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default PlanList