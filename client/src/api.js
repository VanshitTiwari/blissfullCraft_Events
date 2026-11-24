
const TOKEN_KEY = "blisscraft_token";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api(
  path,
  { method = "GET", body, auth = false } = {}
) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (auth) {
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}
