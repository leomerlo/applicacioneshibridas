import API from './api.service';

export function login({ userName, password }: { userName: string, password: string }) {
  return API.call({ uri: 'session', method: 'POST', body: { userName, password } })
}

export function logout() {
  return API.call({ uri: 'session', method: 'DELETE' })
}

export default {
  login,
  logout
}