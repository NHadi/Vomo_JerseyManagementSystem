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
import { productCategoryAPI } from './modules/product-categories.js';
import { userAPI } from './modules/users.js';
import { orderAPI } from './modules/orders.js';
import { taskAPI } from './modules/tasks.js';
import { itemAPI } from './modules/items.js';
import { paymentAPI } from './modules/payments.js';
import { stockOpnameAPI } from './modules/stock-opnames.js';
import { stockMovementAPI } from './modules/stock-movements.js';
import { supplierAPI } from './modules/suppliers.js';
import { config } from './config.js';
import { cashFlowAPI } from './modules/cash-flows.js';

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
    ...productCategoryAPI,
    ...userAPI,
    ...orderAPI,
    ...taskAPI,
    ...itemAPI,
    ...paymentAPI,
    ...stockOpnameAPI,
    ...stockMovementAPI,
    ...supplierAPI,
    ...cashFlowAPI,
    config,
};

// Export to window object for global access
window.vomoAPI = vomoAPI;

export default vomoAPI; 