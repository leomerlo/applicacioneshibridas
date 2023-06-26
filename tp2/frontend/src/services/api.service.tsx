export async function call({ uri, method = 'GET', body = undefined }: { uri: string, method?: string, body?: any }) {
  return fetch(`${import.meta.env.VITE_FG_API}/${uri}`, {
    // @ts-ignore-next-line
    // Maybe we need to add a new type for headers that accomodates for auth-token
    headers: {
      'auth-token': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    method,
    body: JSON.stringify(body)
  }).then(async res => {
    const data = await res.json();
    return {
      status: res.status,
      data
    };
  }).catch(err => {
    throw new Error(err);
  });
}

export default {
  call
}