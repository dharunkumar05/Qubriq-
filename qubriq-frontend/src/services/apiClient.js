const BASE_URL = "/api";

export const CSRF_HEADER = "X-CSRF-TOKEN";

let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token;
};

export const getCachedCsrfToken = () => csrfToken;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function getCsrfToken() {
  const response = await fetch(`${BASE_URL}/auth/csrf`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError(
      "Unable to initialize security token.",
      response.status,
    );
  }

  const data = await response.json();
  csrfToken = data.token || data.csrfToken || data.value || null;
  return csrfToken;
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const normalizedMethod = method.toUpperCase();
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod)) {
    headers[CSRF_HEADER] = await getCsrfToken();
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: normalizedMethod,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Empty responses, such as logout 204, are valid.
  }

  if (response.status === 401) {
    const isLoginRequest = path === "/auth/login";
    const isRegisterRequest = path === "/auth/register";

    if (!isLoginRequest && !isRegisterRequest) {
      window.dispatchEvent(new CustomEvent("qubriq:unauthorized"));
    }

    throw new ApiError(data?.message || "Unauthorized", 401, data);
  }

  if (response.status === 403) {
    throw new ApiError(
      data?.message || "You do not have access to this data",
      403,
      data,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Request failed",
      response.status,
      data,
    );
  }

  return data;
}
