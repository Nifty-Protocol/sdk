import httpRequest from '../utils/httpRequest';

const ENDPOINT = 'external_orders';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    get: (id) => httpRequest({ url: `${URL}/${id}` }),
  }
};
