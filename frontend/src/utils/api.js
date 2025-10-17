import { getToken } from "./tokens";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleJson = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${res.status}`);
  }
  const payload = await res.json();
  return Object.prototype.hasOwnProperty.call(payload, "data")
    ? payload.data
    : payload;
};

const request = (path, options = {}) =>
  fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  }).then(handleJson);

export const getUserInfo = () => request("/users/me");
export const editUserInfo = (name, about) =>
  request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });

export const profilePhotoUpdate = (avatar) =>
  request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });

export const getInitialCards = () => request("/cards");
export const addNewCard = (name, link) =>
  request("/cards", { method: "POST", body: JSON.stringify({ name, link }) });

export const deleteCard = (cardId) =>
  request(`/cards/${cardId}`, { method: "DELETE" });

export const changeLikeCardStatus = (cardId, like) =>
  request(`/cards/${cardId}/likes`, { method: like ? "PUT" : "DELETE" });
