import API from './api.service';

export function getPlan() {
  return API.call({ uri: 'plan' })
}

export function getShoppingList() {
  return API.call({ uri: 'plan/list' })
}

export default {
  getPlan,
  getShoppingList
}