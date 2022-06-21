import HttpRequest from '../utils/HttpRequest';

const ENDPOINT = 'trades';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    getAll: (data) => HttpRequest({url: URL}),
    getStats: (params = {}) => HttpRequest({ url: `${URL}/stats`, params }),
    getGraph: (params = {}) => HttpRequest({
      url: `${URL}/graph`,
      params,
    })
  }
};
