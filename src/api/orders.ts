import httpRequest from '../utils/httpRequest';

const ENDPOINT = 'orders';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    create: (data) => httpRequest({ url: URL, method: 'post', data }),
    get: (id) => httpRequest({ url: `${URL}/${id}` }),
    cancel: (id) => httpRequest({ url: `${URL}/${id}/cancel`, method: 'put' }),
  }
};
