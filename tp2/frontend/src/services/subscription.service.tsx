import API from './api.service';

export function getPreferences() {
  return API.call({ uri: 'preference' });
}