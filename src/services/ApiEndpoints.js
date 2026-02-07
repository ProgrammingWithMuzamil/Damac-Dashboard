export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login/',
    REGISTER: '/register/',
    LOGOUT: '/logout',
    PROFILE: '/profile/',
  },
  USERS: {
    LIST: '/users/',
    DETAIL: (id) => `/users/${id}/`,
  },
  PROPERTIES: {
    LIST: '/properties/',
    DETAIL: (id) => `/properties/${id}/`,
  },
  COLLABORATIONS: {
    LIST: '/collaborations/',
    DETAIL: (id) => `/collaborations/${id}/`,
  },
  SLIDES: {
    LIST: '/slides/',
    DETAIL: (id) => `/slides/${id}/`,
  },
  YOURPERFECT: {
    LIST: '/yourperfect/',
    DETAIL: (id) => `/yourperfect/${id}/`,
  },
  SIDEBAR_CARD: {
    LIST: '/sidebarcard/',
    DETAIL: (id) => `/sidebarcard/${id}/`,
  },
  DAMAC: {
    LIST: '/damac/',
    DETAIL: (id) => `/damac/${id}/`,
  },
  EMPOWERING_COMMUNITIES: {
    LIST: '/empoweringcommunities/',
    DETAIL: (id) => `/empoweringcommunities/${id}/`,
  },
  CMS_SETTINGS: {
    LIST: '/cms-settings/',
    DETAIL: (id) => `/cms-settings/${id}/`,
  },
  AGENTS: {
    LIST: '/agents/',
    DETAIL: (id) => `/agents/${id}/`,
  },
  LEADS: {
    LIST: '/leads/',
    DETAIL: (id) => `/leads/${id}/`,
  },
  PUBLIC: {
    AGENTS: {
      LIST: '/public/agents/',
      DETAIL: (id) => `/public/agents/${id}/`,
    },
    LEADS: {
      LIST: '/public/leads/',
      DETAIL: (id) => `/public/leads/${id}/`,
    },
    HERO: '/public/hero/',
  },
  AGENT: {
  DASHBOARD: '/agent/',

  LEADS: {
    LIST: '/agent/leads/',
    DETAIL: (id) => `/agent/leads/${id}/`,
  },

  ANALYTICS: '/agent/analytics/',
  PROPERTIES: '/agent/properties/',
  APPOINTMENTS: '/agent/appointments/',
  DOCUMENTS: '/agent/documents/',
  REPORTS: '/agent/reports/',
  
  REVENUE: {
    STATS: '/agent/revenue/',
  },
},
  ANALYTICS: {
    OVERVIEW: '/analytics/',
    AGENT_PERFORMANCE: '/analytics/agents/',
    LIST: '/analytics/',
    DETAIL: (id) => `/analytics/${id}/`,
  },
  HERO: {
    LIST: '/hero/',
    DETAIL: (id) => `/hero/${id}/`,
  },
  ADMIN: {
    DEALS: {
      LIST: '/deals/',
      DETAIL: (id) => `/deals/${id}/`,
      CREATE: '/deals/',
    },
  },
};
