import API from './api.service';

export function getRecipie(name: string) {
  return API.call({ uri: `recipie/${name}` })
}

export function likeRecipie(id: string) {
  return API.call({ uri: `recipie/like/${id}` })
}

export function unLikeRecipie(id: string) {
  return API.call({ uri: `recipie/unlike/${id}` })
}

export default {
  getRecipie,
  likeRecipie,
  unLikeRecipie
}