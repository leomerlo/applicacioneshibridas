import { Profile } from '../contexts/ProfileContext';
import API from './api.service';

export function getDashboard() {
  return API.call({ uri: 'admin/dashboard' })
}

export function createAccount(payload: any) {
  return API.call({ uri: 'admin/account', method: 'POST', body: payload });
}

export function getAccount(id: string) {
  return API.call({ uri: `admin/account/${id}`, method: 'GET' });
}

export function updateAccount(id: string, payload: Profile) {
  return API.call({ uri: `admin/account/${id}`, method: 'PATCH', body: {
    user: payload
  }});
}

export default {
  getDashboard,
  createAccount,
  getAccount,
  updateAccount
}