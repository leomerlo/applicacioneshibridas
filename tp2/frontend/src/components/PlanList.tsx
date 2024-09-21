import { Plan } from "../contexts/PlanContext";
import { useProfile } from "../contexts/ProfileContext";
import PlanCard from "./PlanCard";

export type PlanListProps = {
  onClick: (planId: string) => void,
  patientName?: string
}

const PlanList = (props: PlanListProps) => {
  const { plans } = useProfile();

  const planClickHandler = (plan: Plan): void => {
    if (plan.meta.status === "draft") {
      props.onClick(`${plan._id}/assistant`);
    } else {
      props.onClick(plan._id as string);
    }
  }
  
  return (
    <>
      <h2 className="text-xl mb-5">Mis planes</h2>
      <ul className="flex-grow">
        { plans.map((plan: Plan) => (
        <li key={plan._id}>
          <PlanCard plan={plan} onClick={() => { planClickHandler(plan) }}/>
        </li>
        ))}
      </ul>
    </>
  )
}

export default PlanList