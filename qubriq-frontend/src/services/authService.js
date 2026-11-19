import { apiFetch, setCsrfToken } from "./apiClient.js";

export async function getCsrfToken() {
  const data = await apiFetch("/auth/csrf");
  setCsrfToken(data?.token || data?.csrfToken || data?.value);
  return data;
}

export const register = (payload) => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: payload,
  });
};

export const login = ({ identifier, password, rememberMe }) => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: {
      identifier,
      password,
      rememberMe,
    },
  });
};

export const logout = () => {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
};

export async function getMe() {
  try {
    const data = await apiFetch("/auth/me");
    return data?.user || data;
  } catch (error) {
    if (error.status === 401) {
      return null;
    }

    throw error;
  }
}
