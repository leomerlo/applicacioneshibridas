import API from './api.service';
import { Profile } from '../contexts/ProfileContext';
import { Plan } from '../contexts/PlanContext';

export function getPatients() {
  return API.call({ uri: 'patients', method: 'GET' })
}

export function addPatient({ userName, password, type }: { userName: string, password: string, type: "user" | "doc" | "admin" } ) {
  return API.call({ uri: 'patient', method: 'POST', body: { userName, password, type } })
}

export function getPatient(id: string) {
  return API.call({ uri: `patient/${id}`, method: 'GET' })
}

export function assignPlan({ patientId, planId }: { patientId: string, planId: string }) {
  return API.call({ uri: `plan/${planId}/${patientId}`, method: 'POST' })
};

export interface Patient extends Profile {
  plan: Plan | null
}

export default {
  getPatients,
  addPatient,
  getPatient,
  // removePatient,
  // updatePatient
}