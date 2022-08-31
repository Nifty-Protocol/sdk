import httpRequest from '../utils/httpRequest';

const ENDPOINT = 'tokens';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    get: (contractAddress, tokenID, params = {}) => httpRequest({ url: `${URL}/${contractAddress}/${tokenID}`, params }),
    refresh: (id, params = {}) => httpRequest({ url: `${URL}/${id}/refresh`, params }),
    getOwner: (params = {}) => httpRequest({ url: `${URL}/owner`, params }),
    getGraph: (params = {}) => httpRequest({ url: `${URL}/graph`, params }),
    traits: (id, params = {}) => httpRequest({ url: `${URL}/${id}/traits`, params }),
    getAll: (params = {}) => httpRequest({ url: `${URL}`, params }),
    report: (data) => httpRequest({
      url   : `${URL}/reports`,
      data,
      method: 'post',
    })
  }
};

