const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('edukad_token', token);
    } else {
      localStorage.removeItem('edukad_token');
    }
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('edukad_token');
  }
  return null;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authToken || getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || `خطای سرور: ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(' - ') : message);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (phone: string, password: string) =>
      fetchApi<{ accessToken: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      }),
    getMe: () => fetchApi<any>('/auth/me'),
  },

  users: {
    getAll: (role?: string, department?: string) => {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (department) params.append('department', department);
      return fetchApi<any[]>(`/users?${params.toString()}`);
    },
    getOne: (id: string) => fetchApi<any>(`/users/${id}`),
    update: (id: string, data: any) =>
      fetchApi<any>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  roadmaps: {
    getAll: (department?: string, status?: string) => {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (status) params.append('status', status);
      return fetchApi<any[]>(`/roadmaps?${params.toString()}`);
    },
    getBySlug: (slug: string) => fetchApi<any>(`/roadmaps/${slug}`),
    createRoadmap: (data: any) =>
      fetchApi<any>('/roadmaps', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateRoadmap: (id: string, data: any) =>
      fetchApi<any>(`/roadmaps/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    deleteRoadmap: (id: string) =>
      fetchApi<any>(`/roadmaps/${id}`, {
        method: 'DELETE',
      }),
    createNode: (data: any) =>
      fetchApi<any>('/roadmaps/nodes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateNode: (id: string, data: any) =>
      fetchApi<any>(`/roadmaps/nodes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    deleteNode: (id: string) =>
      fetchApi<any>(`/roadmaps/nodes/${id}`, {
        method: 'DELETE',
      }),
    addPrerequisite: (nodeId: string, prerequisiteNodeId: string) =>
      fetchApi<any>(`/roadmaps/nodes/${nodeId}/prerequisites`, {
        method: 'POST',
        body: JSON.stringify({ prerequisiteNodeId }),
      }),
    removePrerequisite: (nodeId: string, prereqId: string) =>
      fetchApi<any>(`/roadmaps/nodes/${nodeId}/prerequisites/${prereqId}`, {
        method: 'DELETE',
      }),
    addResource: (nodeId: string, resource: any) =>
      fetchApi<any>(`/roadmaps/nodes/${nodeId}/resources`, {
        method: 'POST',
        body: JSON.stringify(resource),
      }),
    deleteResource: (resourceId: string) =>
      fetchApi<any>(`/roadmaps/resources/${resourceId}`, {
        method: 'DELETE',
      }),
    updatePositions: (updates: { id: string; positionX: number; positionY: number }[]) =>
      fetchApi<any>('/roadmaps/nodes/batch/positions', {
        method: 'PATCH',
        body: JSON.stringify({ updates }),
      }),
  },

  enrollments: {
    enrollStudent: (data: { studentId: string; roadmapId: string; mentorId?: string }) =>
      fetchApi<any>('/enrollments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMyEnrollments: () => fetchApi<any[]>('/enrollments/my'),
    getAll: () => fetchApi<any[]>('/enrollments'),
  },

  progress: {
    startNode: (nodeId: string) =>
      fetchApi<any>(`/progress/nodes/${nodeId}/start`, {
        method: 'POST',
      }),
    completeDirect: (nodeId: string) =>
      fetchApi<any>(`/progress/nodes/${nodeId}/complete-direct`, {
        method: 'POST',
      }),
    getStudentProgress: (roadmapId: string) =>
      fetchApi<any[]>(`/progress/roadmaps/${roadmapId}`),
  },

  submissions: {
    submitDeliverable: (data: { nodeId: string; submissionUrl: string; submissionNote?: string }) =>
      fetchApi<any>('/submissions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getReviewQueue: () => fetchApi<any[]>('/submissions/queue'),
    getMentorDashboard: () => fetchApi<any[]>('/submissions/dashboard'),
    reviewSubmission: (submissionId: string, outcome: 'APPROVED' | 'REJECTED', mentorFeedback?: string) =>
      fetchApi<any>(`/submissions/${submissionId}/review`, {
        method: 'POST',
        body: JSON.stringify({ outcome, mentorFeedback }),
      }),
    getHistory: (progressId: string) =>
      fetchApi<any[]>(`/submissions/progress/${progressId}/history`),
  },

  notifications: {
    getAll: () => fetchApi<any[]>('/notifications'),
    getUnreadCount: () => fetchApi<{ unreadCount: number }>('/notifications/unread-count'),
    markAsRead: (id: string) =>
      fetchApi<any>(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
    markAllAsRead: () =>
      fetchApi<any>('/notifications/read-all', {
        method: 'PATCH',
      }),
  },
};
