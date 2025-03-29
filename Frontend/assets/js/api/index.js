import { authAPI } from './modules/auth.js';
import { menuAPI } from './modules/menus.js';
import { auditAPI } from './modules/audits.js';
import { roleAPI } from './modules/roles.js';
import { backupAPI } from './modules/backups.js';
import { zoneAPI } from './modules/zones.js';
import { regionAPI } from './modules/regions.js';
import { officeAPI } from './modules/offices.js';
import { divisionAPI } from './modules/divisions.js';
import { employeeAPI } from './modules/employees.js';
import { productAPI } from './modules/products.js';
import { permissionAPI } from './modules/permissions.js';
import { config } from './config.js';

// Initialize the API namespace
export const vomoAPI = {
    ...authAPI,
    ...menuAPI,
    ...auditAPI,
    ...roleAPI,
    ...backupAPI,
    ...zoneAPI,
    ...regionAPI,
    ...officeAPI,
    ...divisionAPI,
    ...employeeAPI,
    ...productAPI,
    ...permissionAPI,
    config
};

// Export to window object for global access
window.vomoAPI = vomoAPI;

export default vomoAPI; 