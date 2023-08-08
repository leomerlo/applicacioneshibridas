import { Profile } from '../contexts/ProfileContext';
import API from './api.service';

export function register({ userName, password, type, idDocument = null, idLicense = null}: { userName: string, password: string, idDocument?: string | null, idLicense?: string | null, type: string }) {
  return API.call({ uri: 'account', method: 'POST', body: { userName, password, type, idDocument, idLicense } })
}

export function getSession() {
  return API.call({ uri: 'profile' })
}

export function updateProfile(profileData: Profile) {
  return API.call({ uri: 'profile', method: 'PATCH', body: profileData })
}

export function updateAccount(accountData: {
  _id: string,
  userName: string,
  password: string,
}) {
  return API.call({ uri: 'account', method: 'PATCH', body: accountData })
}

export function forgotPassword(email: string) {
  return API.call({ uri: 'account/forgot', method: 'POST', body: { email } })
}

export function resetPassword({ accountId, token, password }: { accountId: string, token: string, password: string }) {
  return API.call({ uri: 'account/passwordReset', method: 'POST', body: { accountId, token, password } });
}

export default {
  register,
  getSession,
  updateProfile,
  updateAccount,
  forgotPassword,
  resetPassword
}