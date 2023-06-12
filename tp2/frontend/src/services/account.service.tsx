import API from './api.service';

export function register({ userName, password }: { userName: string, password: string }) {
  return API.call({ uri: 'account', method: 'POST', body: { userName, password } })
}

export default {
  register,
}