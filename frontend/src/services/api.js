// src/services/api.js
import axios from 'axios';

// Configuration de base d'axios - FORCER L'URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true // Important pour les sessions
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(async (config) => {
  // Ajouter le token JWT si disponible
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si erreur 401 (token expiré), rediriger vers login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
    
    return Promise.reject(error);
  }
);

// Fonctions API spécifiques
export const authAPI = {
  login: (credentials) => api.post('/utilisateurs/login', credentials),
  register: (userData) => api.post('/utilisateurs/register', userData),
  // logout: JWT Stateless - pas besoin de route API, géré côté client uniquement
  getProfile: () => api.get('/utilisateurs/profile'),
  updateProfile: (userData) => api.put('/utilisateurs/profile', userData),
  changePassword: (passwordData) => api.put('/utilisateurs/change-password', passwordData)
};

export const projectsAPI = {
  getAll: () => api.get('/projets'),
  getById: (id) => api.get(`/projets/${id}`),
  create: (projectData) => api.post('/projets', projectData),
  update: (id, projectData) => api.put(`/projets/${id}`, projectData),
  delete: (id) => api.delete(`/projets/${id}`),
  getAssigned: () => api.get('/projets/assigned')
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`)
};

export const quotesAPI = {
  getAll: () => api.get('/devis'),
  getById: (id) => api.get(`/devis/${id}`),
  create: (quoteData) => api.post('/devis', quoteData),
  update: (id, quoteData) => api.put(`/devis/${id}`, quoteData),
  delete: (id) => api.delete(`/devis/${id}`),
  getAssigned: () => api.get('/devis/assigned')
};

export const reviewsAPI = {
  getAll: () => api.get('/avis'),
  getById: (id) => api.get(`/avis/${id}`),
  create: (reviewData) => api.post('/avis', reviewData),
  update: (id, reviewData) => api.put(`/avis/${id}`, reviewData),
  delete: (id) => api.delete(`/avis/${id}`),
  validate: (id, status) => api.patch(`/avis/${id}/validate`, { status }),
  getFirebase: () => api.get('/avis/debug/firebase'),
  syncFirebase: () => api.post('/avis/sync/firebase')
};

export const contactAPI = {
  create: (contactData) => api.post('/contacts', contactData),
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  update: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  delete: (id) => api.delete(`/contacts/${id}`)
};

export const statsAPI = {
  getOverview: () => api.get('/statistiques/overview'),
  getUsers: () => api.get('/statistiques/utilisateurs'),
  getProjects: () => api.get('/statistiques/projets'),
  getServices: () => api.get('/statistiques/services'),
  getQuotes: () => api.get('/statistiques/devis'),
  getReviews: () => api.get('/statistiques/avis')
};

export default api; 