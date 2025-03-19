
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api'; // This would be your actual API URL

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string | null;
  contentType?: string;
}

export async function apiRequest<T>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    token,
    contentType = 'application/json'
  } = options;

  const headers: HeadersInit = {
    'Content-Type': contentType,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    config.body = contentType === 'application/json' ? JSON.stringify(body) : body;
  }

  try {
    // For now, we'll mock the API responses
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock API responses based on the endpoint and method
    let mockResponse;
    
    if (endpoint === '/tests' && method === 'GET') {
      mockResponse = {
        success: true,
        data: Array(5).fill(null).map((_, i) => ({
          id: `test-${i}`,
          name: `Test ${i + 1}`,
          emailAccount: {
            id: `email-${i}`,
            address: `test${i + 1}@example.com`,
            uuid: `uuid-${i}`
          },
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          status: ['completed', 'in_progress', 'pending'][i % 3]
        }))
      };
    } else if (endpoint === '/tests' && method === 'POST') {
      mockResponse = {
        success: true,
        data: {
          id: `test-${Date.now()}`,
          name: body.name,
          emailAccount: {
            id: body.emailAccountId,
            address: `test${Math.floor(Math.random() * 8) + 1}@example.com`,
            uuid: `uuid-${Date.now()}`
          },
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      };
    } else if (endpoint.startsWith('/tests/') && method === 'GET') {
      const testId = endpoint.split('/').pop();
      mockResponse = {
        success: true,
        data: {
          id: testId,
          name: `Test Details for ${testId}`,
          emailAccount: {
            id: `email-${testId}`,
            address: `test${testId?.replace('test-', '')}@example.com`,
            uuid: `uuid-${testId}`
          },
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          status: 'in_progress',
          responses: Array(3).fill(null).map((_, i) => ({
            id: `response-${i}`,
            subject: `Response subject ${i + 1}`,
            content: `This is the content of email response ${i + 1}. It includes the test taker's answers and feedback.`,
            receivedAt: new Date(Date.now() - i * 3600000).toISOString()
          }))
        }
      };
    } else if (endpoint === '/emails' && method === 'GET') {
      mockResponse = {
        success: true,
        data: Array(8).fill(null).map((_, i) => ({
          id: `email-${i}`,
          address: `test${i + 1}@example.com`,
          uuid: `uuid-${i}`,
          available: i % 3 !== 0 // Make some unavailable to simulate real usage
        }))
      };
    } else {
      mockResponse = {
        success: true,
        data: { message: 'Operation completed successfully' }
      };
    }
    
    if (!mockResponse.success) {
      throw new Error(mockResponse.message || 'An error occurred');
    }
    
    return mockResponse.data as T;
  } catch (error) {
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast.error(message);
    throw error;
  }
}

// API Function for Tests
export const testsApi = {
  getAll: (token: string) => apiRequest<any[]>('/tests', { token }),
  getById: (id: string, token: string) => apiRequest<any>(`/tests/${id}`, { token }),
  create: (data: any, token: string) => apiRequest<any>('/tests', { method: 'POST', body: data, token }),
  sendEmail: (testId: string, data: any, token: string) => 
    apiRequest<any>(`/tests/${testId}/send`, { method: 'POST', body: data, token })
};

// API Function for Email Accounts
export const emailsApi = {
  getAll: (token: string) => apiRequest<any[]>('/emails', { token })
};
