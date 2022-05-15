import HttpRequest from '../utils/HttpRequest';
import config from '../config';

const URL = `${config.api}orders`;

const create = (data) => HttpRequest({ url: URL, method: 'post', data });
const get = (id) => HttpRequest({ url: `${URL}/${id}` });
const cancel = (id) => HttpRequest({ url: `${URL}/${id}/cancel`, method: 'put' });

export default {
  create,
  get,
  cancel,
};
