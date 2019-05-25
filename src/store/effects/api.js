import Config from 'react-native-config'

import { authGetToken } from "./accessToken";

export default async (dispatch, path, options) => {
  const token = await dispatch(authGetToken());
  if(!token) {
    console.log(`Token Not Found : ${path}`);
    return null;
  }

  const defaultHeaders = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  }

  resultOption = {
    headers: defaultHeaders
  }
  if(options) {
    resultOption = {
      ...options
    }

    if(options.headers) {
      resultOption.headers = {
        ...defaultHeaders,
        ...options.headers
      }
    }
  }

  try {
    const res = await fetch(`${Config.PARTI_API_BASE_URL}/api/v1${path}`, resultOption);
    result = await res.json();
    console.log(result);
    return result;
  } catch(err) {
    console.log("API error")
    console.log(err);
    throw err;
  }
};
