import { api } from './index';

export const axios_get_call = (url, params = {}, config = {}) => {
  if (typeof url !== 'string') {
    throw new Error('Invalid URL passed to axios_get_call');
  }
  return api.get(url, { params, ...config });
};

export const axios_post_call = (url, data = {}, config = {}) => {
  // Automatically set Content-Type for FormData
  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }
  return api.post(url, data, config);
};

export const axios_put_call = (url, data = {}, config = {}) => {
  // Automatically set Content-Type for FormData
  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }
  return api.put(url, data, config);
};

export const axios_patch_call = (url, data = {}, config = {}) => {
  // Automatically set Content-Type for FormData
  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }
  return api.patch(url, data, config);
};

export const axios_delete_call = (url, config = {}) => {
  return api.delete(url, config);
};
