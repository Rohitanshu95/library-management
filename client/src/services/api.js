const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://library-management-2-bbfl.onrender.com/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication & Profile
  login: async (email, password, requestedRole) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, requestedRole }),
    });
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  demoLogin: async (role) => {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return res.json();
  },

  // Inquiries
  submitInquiry: async (inquiryData) => {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    return res.json();
  },

  getInquiries: async (status = '', search = '') => {
    const res = await fetch(`${API_BASE}/inquiries?status=${status}&search=${encodeURIComponent(search)}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateInquiryStatus: async (id, status, note) => {
    const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, note }),
    });
    return res.json();
  },

  // Library
  getLibraryPlans: async () => {
    const res = await fetch(`${API_BASE}/library/plans`);
    return res.json();
  },

  getMyLibrarySubscription: async () => {
    const res = await fetch(`${API_BASE}/library/my-subscription`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  verifyTicket: async (payload) => {
    const res = await fetch(`${API_BASE}/library/verify-ticket`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Courses
  getCourses: async (category = '') => {
    const res = await fetch(`${API_BASE}/courses?category=${category}`);
    return res.json();
  },

  getCourseById: async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    return res.json();
  },

  getMyEnrolledCourses: async () => {
    const res = await fetch(`${API_BASE}/courses/my/enrolled`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateCourseProgress: async (courseId, lessonId) => {
    const res = await fetch(`${API_BASE}/courses/${courseId}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ lessonId }),
    });
    return res.json();
  },

  // PDFs
  getPdfs: async (category = '') => {
    const res = await fetch(`${API_BASE}/pdfs?category=${category}`);
    return res.json();
  },

  getMyPurchasedPdfs: async () => {
    const res = await fetch(`${API_BASE}/pdfs/my/purchased`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  recordPdfDownload: async (id) => {
    const res = await fetch(`${API_BASE}/pdfs/${id}/download`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Tests
  getMockTests: async (category = '') => {
    const res = await fetch(`${API_BASE}/tests?category=${category}`);
    return res.json();
  },

  startTestAttempt: async (testId) => {
    const res = await fetch(`${API_BASE}/tests/${testId}/start`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  saveTestProgress: async (attemptId, answers) => {
    const res = await fetch(`${API_BASE}/tests/attempt/${attemptId}/save-progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers }),
    });
    return res.json();
  },

  submitTestAttempt: async (attemptId, answers) => {
    const res = await fetch(`${API_BASE}/tests/attempt/${attemptId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers }),
    });
    return res.json();
  },

  getMyTestHistory: async () => {
    const res = await fetch(`${API_BASE}/tests/my/history`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Payments & Entitlements
  createOrder: async (data) => {
    const res = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyPayment: async (data) => {
    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getMyTransactions: async () => {
    const res = await fetch(`${API_BASE}/payment/my/transactions`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Admin Metrics
  getAdminMetrics: async () => {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getAllTransactions: async () => {
    const res = await fetch(`${API_BASE}/admin/transactions`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  recordExpense: async (expenseData) => {
    const res = await fetch(`${API_BASE}/admin/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    });
    return res.json();
  },

  // Admin User Dossier & Management
  getAllUsers: async (search = '', targetExam = '', status = '') => {
    const res = await fetch(
      `${API_BASE}/admin/users?search=${encodeURIComponent(search)}&targetExam=${targetExam}&status=${status}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getUserDossier: async (userId) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateUserStatus: async (userId, status) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};
