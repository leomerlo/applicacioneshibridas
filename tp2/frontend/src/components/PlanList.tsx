import { Plan } from "../contexts/PlanContext";
import { useProfile } from "../contexts/ProfileContext";
import PlanCard from "./PlanCard";

export type PlanListProps = {
  onClick: (planId: string) => void,
  patientName?: string,
  active?: string
}

const PlanList = (props: PlanListProps) => {
  const { plans } = useProfile();

  const planClickHandler = (plan: Plan): void => {
    props.onClick(`${plan._id}`);
  }

  const isActive = (id: string) => {
    if (props.active === id) {
      return true;
    }
    return false;
  }
  
  return (
    <>
      <ul className="flex-grow">
        { plans.map((plan: Plan) => (
        <li key={plan._id}>
          <PlanCard plan={plan} onClick={() => { planClickHandler(plan) }} active={isActive(plan._id as string)}/>
        </li>
        ))}
      </ul>
    </>
  )
}

export default PlanList