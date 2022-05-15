import HttpRequest from '../utils/HttpRequest';
import config from '../config';

const URL = `${config.api}contracts`;

export const getAll = (params = {}) => HttpRequest({ url: `${URL}`, params });
export const get = (id) => HttpRequest({ url: `${URL}/${id}` });
export const count = (params = {}) => HttpRequest({ url: `${URL}/get/count`, params });
export const byAddress = (chainId, address) => HttpRequest({ url: `${URL}/${chainId}/${address}` });
export const getTraits = (id, params = {}) => HttpRequest({ url: `${URL}/${id}/traits`, params });
export const update = (token, id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return HttpRequest({
    url    : `${URL}/${id}`,
    data   : formData,
    headers: {
      'x-access-token': token,
      'Content-Type'  : 'multipart/form-data',
    },
    method: 'put',
  });
};
export const getRoyalties = (contractId, params = {}) => HttpRequest({
  url: `${URL}/${contractId}/royalties`, params,
});
export const getStats = (id, params = {}) => HttpRequest({ url: `${URL}/${id}/stats`, params });

export default {
  getAll,
  get,
  update,
  byAddress,
  getTraits,
  getRoyalties,
  count,
  getStats,
};
