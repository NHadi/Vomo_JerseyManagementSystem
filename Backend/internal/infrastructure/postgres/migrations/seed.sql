-- Insert default tenant first (if not exists)
INSERT INTO public.master_tenant (id, name, domain) 
VALUES (1, 'Default Tenant', 'default.vomo.com')
ON CONFLICT DO NOTHING;

-- Insert admin role with tenant
INSERT INTO public.master_role (id, name, description, tenant_id)
VALUES 
    (1, 'Admin', 'System Administrator', 1),
    (2, 'Manager', 'Department Manager', 1),
    (3, 'Staff', 'Regular Staff', 1)
ON CONFLICT DO NOTHING;

-- Insert permissions with tenant
INSERT INTO public.master_permission (id, name, description, tenant_id)
VALUES
    (1, 'create', 'Create permission', 1),
    (2, 'read', 'Read permission', 1),
    (3, 'update', 'Update permission', 1),
    (4, 'delete', 'Delete permission', 1)
ON CONFLICT DO NOTHING;

-- Assign permissions to roles
INSERT INTO public.role_permissions (role_id, permission_id)
VALUES
    (1, 1), (1, 2), (1, 3), (1, 4),  -- Admin gets all permissions
    (2, 2), (2, 3),                   -- Manager gets read and update
    (3, 2)                            -- Staff gets read only
ON CONFLICT DO NOTHING;

-- Insert main menus with tenant_id
INSERT INTO public.master_menu (id, name, url, icon, parent_id, sort, tenant_id)
VALUES 
    (1, 'Access Management', NULL, 'ni ni-settings', NULL, 1, 1),
    (2, 'Master Data', NULL, 'ni ni-archive-2', NULL, 2, 1),
    (3, 'Transaction', NULL, 'ni ni-cart', NULL, 3, 1),
    (4, 'Inventory', NULL, 'ni ni-box-2', NULL, 4, 1),
    (5, 'Accounting', NULL, 'ni ni-money-coins', NULL, 5, 1),
    -- Access Management submenus
    (6, 'Permission', '/permission', 'ni ni-key-25', 1, 1, 1),
    (7, 'Role', '/role', 'ni ni-badge', 1, 2, 1),
    (8, 'User', '/user', 'ni ni-single-02', 1, 3, 1),
    (9, 'Menu', '/menu', 'ni ni-bullet-list-67', 1, 4, 1),
    -- Master Data submenus
    (10, 'Zone', '/zone', 'ni ni-map-big', 2, 1, 1),
    (11, 'Region', '/region', 'ni ni-world-2', 2, 2, 1),
    (12, 'Office', '/office', 'ni ni-building', 2, 3, 1),
    (13, 'Product', '/product', 'ni ni-box-2', 2, 4, 1),
    (14, 'Product Category', '/product-category', 'ni ni-tag', 2, 5, 1),
    (15, 'Employee', '/employee', 'ni ni-circle-08', 2, 6, 1),
    (16, 'Division', '/division', 'ni ni-collection', 2, 7, 1),
    -- Transaction submenus
    (17, 'Order', '/order', 'ni ni-cart', 3, 1, 1),
    (18, 'Order Detail', '/order-detail', 'ni ni-bullet-list-67', 3, 2, 1),
    (19, 'Order Detail Item', '/order-detail-item', 'ni ni-box-2', 3, 3, 1),
    (20, 'Payment', '/payment', 'ni ni-money-coins', 3, 4, 1),
    (21, 'Payment Detail', '/payment-detail', 'ni ni-bullet-list-67', 3, 5, 1),
    (22, 'Task', '/task', 'ni ni-calendar-grid-58', 3, 6, 1),
    (23, 'Task History', '/task-history', 'ni ni-time-alarm', 3, 7, 1),
    -- Inventory submenus
    (24, 'Master Item', '/master-item', 'ni ni-box-2', 4, 1, 1),
    (25, 'Stock Name', '/stock-name', 'ni ni-tag', 4, 2, 1),
    (26, 'Master Supplier', '/master-supplier', 'ni ni-delivery-fast', 4, 3, 1),
    -- Accounting submenus
    (27, 'Cash Flow', '/cash-flow', 'ni ni-money-coins', 5, 1, 1),
    (28, 'Purchase List', '/purchase-list', 'ni ni-cart', 5, 2, 1),
    (29, 'Payment List', '/payment-list', 'ni ni-credit-card', 5, 3, 1),
    (30, 'SPK Data', '/spk-data', 'ni ni-file-text', 5, 4, 1),
    (31, 'Petty Cash', '/petty-cash', 'ni ni-money-coins', 5, 5, 1),
    (32, 'Transaction Category', '/transaction-category', 'ni ni-tag', 5, 6, 1),
    (33, 'Petty Cash Request', '/petty-cash-request', 'ni ni-paper-diploma', 5, 7, 1),
    (34, 'Petty Cash Summary', '/petty-cash-summary', 'ni ni-chart-bar-32', 5, 8, 1)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, url = EXCLUDED.url, icon = EXCLUDED.icon, 
    parent_id = EXCLUDED.parent_id, sort = EXCLUDED.sort, tenant_id = EXCLUDED.tenant_id;

-- Assign menus to roles
-- Admin gets all menus
INSERT INTO public.role_menus (role_id, menu_id)
SELECT 1, id FROM public.master_menu WHERE tenant_id = 1
ON CONFLICT DO NOTHING;

-- Manager gets Master Data and Transaction menus
INSERT INTO public.role_menus (role_id, menu_id)
SELECT 2, id FROM public.master_menu 
WHERE (parent_id = 2 OR parent_id = 3) AND tenant_id = 1
ON CONFLICT DO NOTHING;

-- Give Manager the parent menus
INSERT INTO public.role_menus (role_id, menu_id)
VALUES 
    (2, 2),  -- Master Data parent menu
    (2, 3)   -- Transaction parent menu
ON CONFLICT DO NOTHING;

-- Staff gets only Transaction menus
INSERT INTO public.role_menus (role_id, menu_id)
SELECT 3, id FROM public.master_menu 
WHERE parent_id = 3 AND tenant_id = 1
ON CONFLICT DO NOTHING;

-- Give Staff the Transaction parent menu
INSERT INTO public.role_menus (role_id, menu_id)
VALUES (3, 3)
ON CONFLICT DO NOTHING;

-- Insert default admin user
INSERT INTO public.users (username, email, password, role_id, tenant_id)
VALUES (
    'admin',
    'admin@vomo.com',
    '$2a$10$ZOlYP9/5gHzKQmYX6JqOu.vHoFxVtcHQ.OhEb1ej0qKqkUoEGNHVe',  -- hashed 'admin123'
    1,  -- Admin role
    1   -- Default tenant
) ON CONFLICT DO NOTHING;