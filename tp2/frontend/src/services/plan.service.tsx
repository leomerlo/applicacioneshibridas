import API from './api.service';

export function getPlan() {
  return API.call({ uri: 'plan' })
}

export default {
  getPlan
}