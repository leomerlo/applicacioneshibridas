import API from './api.service';

export function newPlan() {
  return API.call({ uri: 'plan', method: 'POST' })
}

export function newDocPlan({ title, preferences, restrictions, thread, listado }: { title: string, preferences: string, restrictions: string, thread: string, listado: string}) {
  return API.call({ uri: 'plan/doc', method: 'POST', body: { title, preferences, restrictions, thread, listado } })
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
  return API.call({ uri: 'plan/list', method: 'POST' })
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

export function newPlanAssistant({ title, preferences, restrictions }: { title: string, preferences: string, restrictions: string }) {
  return API.call({ uri: 'plan/assistant/thread', method: 'POST', body: { preferences, restrictions, title } })
}

export function getPlanAssistantThread(threadId: string) {
  return API.call({ uri: `plan/assistant/thread/${threadId}` })
}

export function assistantSendMessage(threadId: string, message: string, dataCB: (data: any) => void, dataEnd: (response: any) => void) {
  return API.callStream({
    uri: `plan/assistant/message`,
    method: 'POST',
    body: { thread: threadId, message },
    dataCB,
    dataEnd
  });
  // return API.call({ uri: 'plan/assistant/message', method: 'POST', body: { thread: threadId, message } })
}

export default {
  newPlan,
  getPlan,
  getPlanById,
  getPlans,
  newDocPlan,
  getShoppingList,
  deletePlan,
  replaceRecipie,
  newPlanAssistant,
  getPlanAssistantThread,
  assistantSendMessage
}