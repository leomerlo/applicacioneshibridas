import API from './api.service';

export function newPlan(dataCB: (data: any) => void, dataEnd: (response: any) => void) {
  return API.callStream({ uri: 'plan', method: 'POST', dataCB, dataEnd })
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

export function replaceRecipie(day: string, meal: string, dataCB: (data: any) => void, dataEnd: (response: any) => void) {
  return API.callStream({
    uri: `plan/replace/${day}/${meal}`,
    method: 'POST',
    dataCB,
    dataEnd
  });
}

export default {
  newPlan,
  getPlan,
  getPlanById,
  getPlans,
  newDocPlan,
  getShoppingList,
  deletePlan,
  replaceRecipie
}