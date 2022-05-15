import HttpRequest from '../utils/HttpRequest';
import config from '../config';

const URL = `${config.api}users`;

const get = (token, id, params = {}) => HttpRequest({
  url    : `${URL}/${id}`,
  headers: {
    'x-access-token': token,
    'Content-Type'  : 'multipart/form-data',
  },
  method: 'get',
  params,
});
const getAll = (params = {}) => HttpRequest({ url: `${URL}`, params });
const getByAddress = (userAddress) => HttpRequest({ url: `${URL}/address/${userAddress}` });
const count = (params = {}) => HttpRequest({ url: `${URL}/get/count`, params });

export default {
  get,
  getAll,
  getByAddress,
  count,
};
