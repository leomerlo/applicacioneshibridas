import { Plan } from "../contexts/PlanContext";
import PlanCard from "./PlanCard";

export type PlanListProps = {
  plans: Plan[],
  onPlanClick: (planId: string) => void,
  patientName?: string
}

const PlanList = (props: PlanListProps) => {
  const planClickHandler = (plan: Plan): void => {
    if (plan.meta.status === "draft") {
      props.onPlanClick(`${plan._id}/assistant`);
    } else {
      props.onPlanClick(plan._id as string);
    }
  }
  
  return (
    <div className="patient-list h-full flex flex-col overflow-y-auto">
      { props.patientName ? <p className="mb-8">
        Seleccioná un plan para asignarlo al paciente { props.patientName }.
      </p> : <p className="mb-8"></p>}
      
      <ul className="flex-grow">
        { props.plans.map((plan: Plan) => (
        <li key={plan._id}>
          <PlanCard plan={plan} onClick={() => { planClickHandler(plan) }}/>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default PlanList