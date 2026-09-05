/**
 * Centralized API layer for QuickAI.
 *
 * Every network call the frontend makes to the Django backend goes
 * through this file so that:
 *   - the backend base URL lives in one place (NEXT_PUBLIC_API_URL)
 *   - JWT tokens are attached and refreshed consistently
 *   - errors are normalized into a predictable shape
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "quickai_access_token";
const REFRESH_TOKEN_KEY = "quickai_refresh_token";

// ---------------------------------------------------------------------------
// Token storage helpers
// ---------------------------------------------------------------------------

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access, refresh }) {
  if (typeof window === "undefined") return;
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

// ---------------------------------------------------------------------------
// Low-level request helper with automatic token refresh
// ---------------------------------------------------------------------------

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_URL}/api/users/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    setTokens({ access: data.access });
    return data.access;
  } catch {
    return null;
  }
}

/**
 * Core request function used by every API helper below.
 *
 * @param {string} path - path relative to API_URL, e.g. "/api/users/profile/"
 * @param {object} options - fetch options (method, body, etc.)
 * @param {boolean} auth - whether to attach the Authorization header
 */
async function request(path, options = {}, auth = true) {
  const doFetch = async (token) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (auth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let res;
    try {
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch (err) {
      throw new ApiError(
        "Could not reach the server. Please check your connection and that the backend is running.",
        0,
        null
      );
    }
    return res;
  };

  let token = auth ? getAccessToken() : null;
  let res = await doFetch(token);

  // If unauthorized, try a single token refresh then retry once.
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    } else {
      clearTokens();
    }
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.error || JSON.stringify(data))) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function registerUser({ username, email, password, first_name, last_name }) {
  return request(
    "/api/users/register/",
    {
      method: "POST",
      body: JSON.stringify({ username, email, password, first_name, last_name }),
    },
    false
  );
}

export async function loginUser({ username, password }) {
  const data = await request(
    "/api/users/login/",
    { method: "POST", body: JSON.stringify({ username, password }) },
    false
  );
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

export function logoutUser() {
  clearTokens();
}

export async function getProfile() {
  return request("/api/users/profile/", { method: "GET" });
}

export async function updateProfile(payload) {
  return request("/api/users/profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

export async function getTools() {
  return request("/api/tools/", { method: "GET" });
}

export async function generateAI({ tool, prompt, options = {} }) {
  return request("/api/tools/generate/", {
    method: "POST",
    body: JSON.stringify({ tool, prompt, options }),
  });
}

// ---------------------------------------------------------------------------
// Credits
// ---------------------------------------------------------------------------

export async function getCredits() {
  return request("/api/credits/", { method: "GET" });
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export async function getHistory() {
  return request("/api/history/", { method: "GET" });
}

export async function deleteHistoryEntry(id) {
  return request(`/api/history/${id}/`, { method: "DELETE" });
}

export async function clearHistory() {
  return request("/api/history/clear/", { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------

export async function changePassword({ old_password, new_password }) {
  return request("/api/users/change-password/", {
    method: "POST",
    body: JSON.stringify({ old_password, new_password }),
  });
}

export { ApiError };
