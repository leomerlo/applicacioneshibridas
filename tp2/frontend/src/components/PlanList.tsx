import { useEffect, useState } from "react";
import { Plan } from "../contexts/PlanContext";
import { useProfile } from "../contexts/ProfileContext";
import Input from "./Input";
import PlanCard from "./PlanCard";

export type PlanListProps = {
  onClick: (planId: string) => void,
  patientName?: string,
  active?: string
}

const PlanList = (props: PlanListProps) => {
  const { plans } = useProfile();
  const [plansFilter, setPlansFilter] = useState("");
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);

  const planClickHandler = (plan: Plan): void => {
    props.onClick(`${plan._id}`);
  }

  const isActive = (id: string) => {
    if (props.active === id) {
      return true;
    }
    return false;
  }

  const planFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlansFilter(e.target.value);
  }

  useEffect(() => {
    if (plansFilter === "") {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter((plan: Plan) => plan.meta.title.toLowerCase().includes(plansFilter.toLowerCase())));
    }
  }
  , [plansFilter]);

  useEffect(() => {
    setFilteredPlans(plans);
  }, [plans]);
  
  return (
    <>
      <div className="mb-4">
        <Input placeholder="Buscar plan" value={plansFilter} onInput={planFilterHandler} name="plans-filter" label="Filtrar planes" srOnly />
      </div>
      { filteredPlans.length === 0 ? <p className="p-4">No hay planes disponibles con esa titulo</p> : <>
        <ul className="flex-grow">
          { filteredPlans.map((plan: Plan) => (
          <li key={plan._id}>
            <PlanCard plan={plan} onClick={() => { planClickHandler(plan) }} active={isActive(plan._id as string)}/>
          </li>
          ))}
        </ul>
      </>}
    </>
  )
}

export default PlanList