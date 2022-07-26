import HttpRequest from '../utils/HttpRequest';

const ENDPOINT = 'contracts';

export default function (base) {
  const URL = base + ENDPOINT;

  const formatData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    });
  }

  return {
    getAll: (params = {}) => HttpRequest({ url: `${URL}`, params }),
    get: (id) => HttpRequest({ url: `${URL}/${id}` }),
    count: (params = {}) => HttpRequest({ url: `${URL}/get/count`, params }),
    byAddress: (chainId, address) => HttpRequest({ url: `${URL}/${chainId}/${address}` }),
    getTraits: (id, params = {}) => HttpRequest({ url: `${URL}/${id}/traits`, params }),
    getRoyalties: (contractId, params = {}) => HttpRequest({
      url: `${URL}/${contractId}/royalties`, params,
    }),
    getStats: (id, params = {}) => HttpRequest({ url: `${URL}/${id}/stats`, params }),
    getTopCollections: (params = {}) => HttpRequest({ url: `${URL}/topCollections`, params }),
  }
}

