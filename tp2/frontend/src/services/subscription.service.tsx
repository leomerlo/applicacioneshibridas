import API from './api.service';

export function subscribe($body: any) {
  return API.call({ uri: 'subscribe', method: 'post', body: $body});
}