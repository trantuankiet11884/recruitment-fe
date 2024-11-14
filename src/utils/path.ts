const PATH = {
  ROOT: '/',
  BLOG: 'blog',
  JOB_DETAIL: '/job/:id',
  JOB_SEEKER: '/job-seeker',
  JOB_LIST: '/jobs',
  // Auth
  USER_SIGN_IN: '/user/sign-in',
  USER_SIGN_UP: '/user/sign-up',
  USER_FORGOT_PASSWORD: '/user/forgot-password',
  USER_RESET_PASSWORD: '/user/reset-password',
  EMPLOYER_SIGN_IN: '/employer/sign-in',
  EMPLOYER_SIGN_UP: '/employer/sign-up',
  UPDATE_JOB: '/employer/update-job',
  EMPLOYER_PERSONAL: '/employer/employer-personal',
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_USER_DETAIL: '/admin/user-detail',
  ADMIN_JOB_MANAGEMENT: '/admin/job-management',
  // Employer
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_POSTING: '/employer/posting-job',
  EMPLOYER_CANDICATES_DASHBOARD: '/employer/manage-candicates',
  EMPLOYER_CANDICATES_MANAGEMENT: '/employer/management-candicates',
  EMPLOYER_RECRUITMENT_LIST: '/employer/manage-job',
  EMPLOYER_RECRUITMENT: '/employer/recruitment',
  // User
  USER_PROFILE: '/user/profile',
  USER_ACCOUNT: '/user/account',
  USER_DESIRED_JOB: '/user/desired-job',
  USER_JOB_APPLICATION: '/user/job-application',
  NOT_FOUND: '*',
};

export default PATH;
