import httpRequest from '../utils/httpRequest';

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
    getAll: (params = {}) => httpRequest({ url: `${URL}`, params }),
    get: (id) => httpRequest({ url: `${URL}/${id}` }),
    count: (params = {}) => httpRequest({ url: `${URL}/get/count`, params }),
    byAddress: (chainId, address) => httpRequest({ url: `${URL}/${chainId}/${address}` }),
    getTraits: (id, params = {}) => httpRequest({ url: `${URL}/${id}/traits`, params }),
    getRoyalties: (contractId, params = {}) => httpRequest({
      url: `${URL}/${contractId}/royalties`, params,
    }),
    getStats: (id, params = {}) => httpRequest({ url: `${URL}/${id}/stats`, params }),
    getTopCollections: (params = {}) => httpRequest({ url: `${URL}/topCollections`, params }),
  }
}

