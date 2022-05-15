import HttpRequest from '../utils/HttpRequest';
import config from '../config';

const TRADES = `${config.api}trades`;

const getStats = (params = {}) => HttpRequest({ url: `${TRADES}/stats/`, params });

const getAll = (data) => HttpRequest({
  url: `${TRADES}`,
});

const getGraph = (params = {}) => HttpRequest({
  url: `${TRADES}/graph`,
  params,
});

export default {
  getStats,
  getAll,
  getGraph,
};
