import HttpRequest from '../utils/HttpRequest';

const ENDPOINT = 'trades';

export default function (base) {
  const URL = base + ENDPOINT;
  return {
    getAll: () => HttpRequest({ url: URL }),
    getStats: (params = {}) => HttpRequest({ url: `${URL}/statsv2`, params }),
    getGraph: (params = {}) => HttpRequest({ url: `${URL}/graph`, params }),
    getCollectionStats: (params = {}) => HttpRequest({ url: `${URL}/stats/contract`, params }),
    getTokenStats: (params = {}) => HttpRequest({ url: `${URL}/stats/token`, params }),
  }

};
