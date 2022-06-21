import HttpRequest from '../utils/HttpRequest';

const ENDPOINT = 'tokens';

export default function(base) {
  const URL = base + ENDPOINT;
  return {
    get: (contractAddress, tokenID, params = {}) => HttpRequest({ url: `${URL}/${contractAddress}/${tokenID}`, params }),
    refresh: (id, params = {}) => HttpRequest({ url: `${URL}/${id}/refresh`, params }),
    getOwner: (params = {}) => HttpRequest({ url: `${URL}/owner`, params }),
    getGraph: (params = {}) => HttpRequest({ url: `${URL}/graph`, params }),
    traits: (id, params = {}) => HttpRequest({ url: `${URL}/${id}/traits`, params }),
    getAll: (params = {}) => HttpRequest({ url: `${URL}`, params }),
    getHomepageData: () => HttpRequest({ url: `${URL}/homepage` }),
    report: (data) => HttpRequest({
      url   : `${URL}/reports`,
      data,
      method: 'post',
    })
  }
};

