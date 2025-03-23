
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api'; // This would be your Express backend URL

const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body,
    token,
    contentType = 'application/json'
  } = options;

  const headers = {
    'Content-Type': contentType,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    config.body = contentType === 'application/json' ? JSON.stringify(body) : body;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast.error(message);
    throw error;
  }
};

// API Function for Tests
export const testsApi = {
  getAll: (token) => apiRequest('/tests', { token }),
  getById: (id, token) => apiRequest(`/tests/${id}`, { token }),
  create: (data, token) => apiRequest('/tests', { method: 'POST', body: data, token }),
  sendEmail: (testId, data, token) => 
    apiRequest(`/tests/${testId}/send-email`, { method: 'POST', body: data, token })
};

// API Function for Email Accounts
export const emailsApi = {
  getAll: (token) => apiRequest('/emails', { token })
};

// Auth API Functions
export const authApi = {
  login: (data) => apiRequest('/login', { method: 'POST', body: data }),
  register: (data) => apiRequest('/register', { method: 'POST', body: data })
};
