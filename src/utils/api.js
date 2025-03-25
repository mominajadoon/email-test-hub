import { toast } from "sonner";

const API_URL = "https://emailbison.onrender.com/api";

const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body,
    token,
    contentType = "application/json",
  } = options;

  const headers = { "Content-Type": contentType };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers, credentials: "include" };
  if (body)
    config.body =
      contentType === "application/json" ? JSON.stringify(body) : body;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Check if response is JSON
    const contentTypeHeader = response.headers.get("content-type");
    if (!contentTypeHeader || !contentTypeHeader.includes("application/json")) {
      throw new Error("Invalid response format (Not JSON)");
    }

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "An error occurred");

    return data;
  } catch (error) {
    toast.error(error.message || "An unexpected error occurred");
    throw error;
  }
};

// API Functions
export const testsApi = {
  getAll: (token) => apiRequest("/tests", { token }),
  getById: (id, token) => apiRequest(`/tests/${id}`, { token }),
  create: (data, token) =>
    apiRequest("/tests", { method: "POST", body: data, token }),
  sendEmail: (testId, data, token) =>
    apiRequest(`/tests/${testId}/send-email`, {
      method: "POST",
      body: data,
      token,
    }),
};

export const emailsApi = {
  getAll: (token) => apiRequest("/emails", { token }),
};

export const authApi = {
  login: (data) => apiRequest("/auth/signin", { method: "POST", body: data }),
  register: (data) =>
    apiRequest("/auth/signup", { method: "POST", body: data }),
};

export const emailApi = {
  send: (data, token) =>
    apiRequest("/email/send-email", { method: "POST", body: data, token }),
};
