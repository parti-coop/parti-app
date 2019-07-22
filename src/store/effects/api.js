import Config from 'react-native-config';

import { accessTokenGetInfoRequested } from './accessToken';

export default async (dispatch, path, options) => {
  const token = await dispatch(accessTokenGetInfoRequested());
  if (!token) {
    // eslint-disable-next-line no-console
    console.warn(`Token Not Found : ${path}`);
    return null;
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  let resultOption = {
    headers: defaultHeaders
  };
  if (options) {
    resultOption = {
      ...options
    };

    if (options.headers) {
      resultOption.headers = {
        ...defaultHeaders,
        ...options.headers
      };
    }
  }

  try {
    const res = await fetch(`${Config.PARTI_API_BASE_URL}/api/v1${path}`, resultOption);
    const result = await res.json();
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('API error', err);
    throw err;
  }
};
