import API from './api.service';

export function newPlan() {
  return API.call({ uri: 'plan', method: 'POST' })
}

export function getPlan() {
  return API.call({ uri: 'plan' })
}

export function getShoppingList() {
  return API.call({ uri: 'plan/list' })
}

export default {
  newPlan,
  getPlan,
  getShoppingList
}