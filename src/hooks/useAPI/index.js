// Libraries
import axios from 'axios';

const useAPI = () => {
  const signal = axios.CancelToken.source();

  const handleError = (e) => {
    if (axios.isCancel(e)) {
      return null;
    }

    console.log(e);
    console.log(e.response);

    throw e;
  };

  const get = async (url, _config = {}) => {
    try {
      const config = {
        headers: {},
        cancelToken: signal.token,
        ..._config,
      };

      const items = await axios.get(`${process.env.REACT_APP_API}${url}`, config);

      return items.data;
    } catch (e) {
      return handleError(e);
    }
  };

  const post = async (url, data, _config = {}) => {
    try {

      const config = {
        headers: {},
        cancelToken: signal.token,
        ..._config,
      };

      const items = await axios.post(`${process.env.REACT_APP_API}${url}`, data, config);

      return items.data;
    } catch (e) {
      return handleError(e);
    }
  };

  const patch = async (url, data, _config = {}) => {
    try {

      const config = {
        headers: {},
        cancelToken: signal.token,
        ..._config,
      };

      const items = await axios.patch(`${process.env.REACT_APP_API}${url}`, data, config);

      return items.data;
    } catch (e) {
      return handleError(e);
    }
  };

  const put = async (url, data, _config = {}) => {
    try {

      const config = {
        headers: {},
        cancelToken: signal.token,
        ..._config,
      };

      const items = await axios.put(`${process.env.REACT_APP_API}${url}`, data, config);

      return items.data;
    } catch (e) {
      return handleError(e);
    }
  };

  const del = async (url, _config = {}) => {
    try {

      const config = {
        headers: {},
        cancelToken: signal.token,
        ..._config,
      };

      const items = await axios.delete(`${process.env.REACT_APP_API}${url}`, config);

      return items.data;
    } catch (e) {
      return handleError(e);
    }
  };

  return {
    get,
    post,
    patch,
    put,
    del,
  };
};

export default useAPI;
