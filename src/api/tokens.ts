import HttpRequest from '../utils/HttpRequest';
import config from '../config';

const URL = `${config.api}tokens`;

export const get = (contractAddress, tokenID, params = {}) => HttpRequest({ url: `${URL}/${contractAddress}/${tokenID}`, params });
export const refresh = (id, params = {}) => HttpRequest({ url: `${URL}/${id}/refresh`, params });
export const getOwner = (params = {}) => HttpRequest({ url: `${URL}/owner`, params });
export const getGraph = (params = {}) => HttpRequest({ url: `${URL}/graph`, params });
export const traits = (id, params = {}) => HttpRequest({ url: `${URL}/${id}/traits`, params });
export const getAll = (params = {}) => HttpRequest({ url: `${URL}`, params });
export const getHomepageData = () => HttpRequest({ url: `${URL}/homepage` });
const report = (data) => HttpRequest({
  url   : `${URL}/reports`,
  data,
  method: 'post',
});

export default {
  get,
  refresh,
  getOwner,
  getGraph,
  traits,
  getAll,
  report,
  getHomepageData,
};
