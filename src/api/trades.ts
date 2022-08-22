import httpRequest from '../utils/httpRequest';

const ENDPOINT = 'trades';

export default function (base) {
  const URL = base + ENDPOINT;
  return {
    getAll: () => httpRequest({ url: URL }),
    getStats: (params = {}) => httpRequest({ url: `${URL}/statsV2`, params }),
    getGraph: (params = {}) => httpRequest({ url: `${URL}/graph`, params }),
    getCollectionStats: (params = {}) => httpRequest({ url: `${URL}/stats/contract`, params }),
    getTokenStats: (params = {}) => httpRequest({ url: `${URL}/stats/token`, params }),
  }

};
