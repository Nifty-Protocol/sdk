import HttpRequest from '../utils/HttpRequest';

const ENDPOINT = 'orders';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    create: (data) => HttpRequest({ url: URL, method: 'post', data }),
    get: (id) => HttpRequest({ url: `${URL}/${id}` }),
    cancel: (id) => HttpRequest({ url: `${URL}/${id}/cancel`, method: 'put' }),
  }
};
