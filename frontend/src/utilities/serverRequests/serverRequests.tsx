import API from './baseUrlForRequests';

export const getData = async (endpoint: string) => {
  const { data } = await API.get(endpoint, { withCredentials: true});
  return data;
}

export const postData = async (endpoint: string, body: any) => {
  const { data } = await API.post(endpoint, body || {}, { withCredentials: true });
  return data;
}

export const putData = async (endpoint: string, body: any) => {
  const { data } = await API.put(endpoint, body || {}, { withCredentials: true });
  return data;
}

export const deleteData = async (endpoint: string) => {
  const { data } = await API.delete(endpoint, { withCredentials: true });
  return data
}