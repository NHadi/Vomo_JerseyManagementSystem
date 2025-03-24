import { authAPI } from './modules/auth.js';
import { menuAPI } from './modules/menus.js';
import { auditAPI } from './modules/audits.js';
import { roleAPI } from './modules/roles.js';
import { config } from './config.js';

// Initialize the API namespace
export const vomoAPI = {
    ...authAPI,
    ...menuAPI,
    ...auditAPI,
    ...roleAPI,
    config
};

// Export to window object for global access
window.vomoAPI = vomoAPI;

export default vomoAPI; 