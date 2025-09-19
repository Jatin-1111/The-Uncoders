// Application routes constants
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    PROFILE: '/profile',
    RESET_PASSWORD: '/reset-password',
    ADMIN_PANEL: '/admin-panel69',
    CONTENT: '/content',
    IT_CONTENT: '/content/it',
    GATE_CONTENT: '/content/gate',
};

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.LOGIN,
    ROUTES.RESET_PASSWORD,
];

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
    ROUTES.PROFILE,
    ROUTES.CONTENT,
    ROUTES.IT_CONTENT,
    ROUTES.GATE_CONTENT,
];

// Admin routes
export const ADMIN_ROUTES = [
    ROUTES.ADMIN_PANEL,
];