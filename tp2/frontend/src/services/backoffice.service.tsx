import API from './api.service';

export function getDashboard() {
  return API.call({ uri: 'admin/dashboard' })
}

export function createAccount(payload: any) {
  return API.call({ uri: 'admin/account', method: 'POST', body: payload });
}

export default {
  getDashboard,
  createAccount
}