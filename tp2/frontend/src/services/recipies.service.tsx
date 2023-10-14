import API from './api.service';

export function getRecipie({ name, profileId }: { name: string, profileId?: string}) {
  const uri = profileId ? `recipie/${profileId}/${name}` : `recipie/${name}`;
  return API.call({ uri })
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