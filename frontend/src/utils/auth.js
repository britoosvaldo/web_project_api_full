const BASE_URL = "http://localhost:3000";

// helper para tratar respostas
const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${res.status}`);
  }
  return res.json(); // esperado { token }
};

// use sempre URL absoluta, sem chance de virar "/signin" relativo ao 5173
export const signin = (email, password) =>
  fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handle);

export const signup = (email, password) =>
  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handle);
