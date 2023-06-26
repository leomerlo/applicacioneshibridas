import { Profile } from '../contexts/ProfileContext';
import API from './api.service';

export function register({ userName, password }: { userName: string, password: string }) {
  return API.call({ uri: 'account', method: 'POST', body: { userName, password } })
}

export function getSession() {
  return API.call({ uri: 'profile' })
}

export function updateProfile(profileData: Profile) {
  return API.call({ uri: 'profile', method: 'POST', body: profileData })
}

export default {
  register,
  getSession,
  updateProfile
}