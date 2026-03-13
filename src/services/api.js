import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('zfe_access');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('zfe_refresh');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
          localStorage.setItem('zfe_access', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('zfe_access');
          localStorage.removeItem('zfe_refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// ─── Helper ───────────────────────────────────────────────────────────────────
const handle = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.error
      || err.response?.data?.detail
      || Object.values(err.response?.data || {})[0]
      || err.message
      || 'حدث خطأ';
    throw new Error(Array.isArray(msg) ? msg[0] : msg);
  }
};

// ============================
// AUTH API
// ============================
export const authAPI = {
  login: async (username, password) => {
    const data = await handle(() => api.post('/auth/login/', { username, password }));
    localStorage.setItem('zfe_access',  data.access);
    localStorage.setItem('zfe_refresh', data.refresh);
    return data;
  },
  logout: async () => {
    const refresh = localStorage.getItem('zfe_refresh');
    try { await api.post('/auth/logout/', { refresh }); } catch {}
    localStorage.removeItem('zfe_access');
    localStorage.removeItem('zfe_refresh');
    return { success: true };
  },
  me: () => handle(() => api.get('/auth/me/')),
  changePassword: (old_password, new_password) =>
    handle(() => api.post('/auth/change-password/', { old_password, new_password })),
};

// ============================
// STUDENTS API
// ============================
export const studentsAPI = {
  getAll: async (grade = null) => {
    const params = grade ? { grade } : {};
    const data = await handle(() => api.get('/students/', { params }));
    return data.results ?? data;
  },
  getById: (id) => handle(() => api.get(`/students/${id}/`)),
  create: (data) => handle(() => api.post('/students/', data)),
  update: (id, data) => handle(() => api.patch(`/students/${id}/`, data)),
  delete: (id) => handle(() => api.delete(`/students/${id}/`)),
  getByBarcode: (barcode) => handle(() => api.get(`/students/barcode/${barcode}/`)),
};

// ============================
// ATTENDANCE API
// ============================
export const attendanceAPI = {
  getAll: async (filters = {}) => {
    const data = await handle(() => api.get('/attendance/', { params: filters }));
    return data.results ?? data;
  },
  markAttendance: (barcode) =>
    handle(() => api.post('/attendance/scan/', { barcode })),
  getStats: () => handle(() => api.get('/attendance/stats/')),
  getMonthlyStats: () => handle(() => api.get('/attendance/monthly-stats/')),
};

// ============================
// PAYMENTS API
// ============================
export const paymentsAPI = {
  getAll: async (filters = {}) => {
    const data = await handle(() => api.get('/payments/', { params: filters }));
    return data.results ?? data;
  },
  markPayment: (barcode) =>
    handle(() => api.post('/payments/scan/', { barcode })),
  getStats: () => handle(() => api.get('/payments/stats/')),
  getMonthlyStats: () => handle(() => api.get('/payments/monthly-stats/')),
  getSettings: () => handle(() => api.get('/payments/settings/')),
  saveSettings: (data) => handle(() => api.post('/payments/settings/', data)),
};

// ============================
// EXAMS API
// ============================
export const examsAPI = {
  getAll: async (filters = {}) => {
    const data = await handle(() => api.get('/exams/results/', { params: filters }));
    return data.results ?? data;
  },
  create: (data) => handle(() => api.post('/exams/results/', data)),
  getPerformanceStats: () => handle(() => api.get('/exams/results/performance-stats/')),
  getWeakStudents: () => handle(() => api.get('/exams/results/weak-students/')),
};

// ============================
// ONLINE EXAMS API
// ============================
export const onlineExamsAPI = {
  getAll: async () => {
    const data = await handle(() => api.get('/exams/online/'));
    return data.results ?? data;
  },
  getById: (id) => handle(() => api.get(`/exams/online/${id}/`)),
  create: (data) => handle(() => api.post('/exams/online/', data)),
  submitResult: (examId, studentName, answers) =>
    handle(() => api.post(`/exams/online/${examId}/submit/`, { student_name: studentName, answers })),
  getResults: (examId) => handle(() => api.get(`/exams/online/${examId}/results/`)),
};

// ============================
// DASHBOARD API
// ============================
export const dashboardAPI = {
  getStats: () => handle(() => api.get('/dashboard/stats/')),
  getGradeStats: () => handle(() => api.get('/dashboard/grade-stats/')),
  getNotifications: () => handle(() => api.get('/dashboard/notifications/')),
};

export default api;