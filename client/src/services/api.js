const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};

export const generatePresentation = (payload) =>
  fetch(`${BASE_URL}/presentations/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const getPresentations = () =>
  fetch(`${BASE_URL}/presentations`).then(handleResponse);

export const getPresentationById = (id) =>
  fetch(`${BASE_URL}/presentations/${id}`).then(handleResponse);

export const updatePresentation = (id, slides) =>
  fetch(`${BASE_URL}/presentations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slides }),
  }).then(handleResponse);

export const deletePresentation = (id) =>
  fetch(`${BASE_URL}/presentations/${id}`, { method: 'DELETE' }).then(handleResponse);

export const getDownloadUrl = (id) =>
  `${BASE_URL}/presentations/${id}/download`;
