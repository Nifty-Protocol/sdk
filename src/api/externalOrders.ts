import HttpRequest from '../utils/HttpRequest';

const ENDPOINT = 'external_orders';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    get: (id) => HttpRequest({ url: `${URL}/${id}` }),
  }
};
