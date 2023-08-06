import API from './api.service';

export function newPlan() {
  return API.call({ uri: 'plan', method: 'POST' })
}

export function newDocPlan({ title, preferences, restrictions }: { title: string, preferences: string, restrictions: string}) {
  return API.call({ uri: 'plan/doc', method: 'POST', body: { title, preferences, restrictions } })
}

export function getPlan() {
  return API.call({ uri: 'plan' })
}

export function getPlanById(id: string) {
  return API.call({ uri: `plan/${id}` })
}

export function getPlans() {
  return API.call({ uri: 'plans' })
}

export function getShoppingList() {
  return API.call({ uri: 'plan/list' })
}

export function deletePlan(id: string) {
  return API.call({ uri: `plan/${id}`, method: 'DELETE' })
}

export default {
  newPlan,
  getPlan,
  getPlanById,
  getPlans,
  newDocPlan,
  getShoppingList,
  deletePlan
}