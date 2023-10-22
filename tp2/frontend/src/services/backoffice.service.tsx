import API from './api.service';

export function getDashboard() {
  return API.call({ uri: 'admin/dashboard' })
}

export default {
  getDashboard
}