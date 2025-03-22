$(function() {
    window.contentLoader = {
        loadContent: function(path) {
            // Remove hash and clean path
            path = path.split('#')[0];
            path = path.replace(/^\/+|\/+$/g, '');
            
            const token = localStorage.getItem('token');
            const tenantId = localStorage.getItem('tenant_id');
            const menus = JSON.parse(localStorage.getItem('menus') || '[]');

            // Find current menu item
            const currentMenu = this.findMenuByPath(menus, path);
            
            if (currentMenu) {

                console.log('Current Menu:', currentMenu); // Add this line to log the current menu inf

                this.updatePageHeader(currentMenu);
                
                switch (path) {
                    case '':
                    case '/':
                        this.loadDashboard();
                        break;
                    case 'menu':
                        this.loadMenuGrid();
                        break;
                    default:
                        this.loadDefaultContent('/' + path);
                }
            } else {
                console.error('Menu not found for path:', path);
                this.loadDefaultContent('/' + path);
            }
        },

        loadMenuGrid: function() {
            // Clean up previous instance if exists
            if (window.menuPageInstance) {
                if (window.menuPageInstance.grid) {
                    window.menuPageInstance.grid.dispose();
                }
                window.menuPageInstance = null;
            }

            $('#main-content').load('components/menu.html', () => {
                // Remove any existing menu.js script tags
                $('script[src="assets/js/pages/menu.js"]').remove();
                
                // Create and append new script tag
                const script = document.createElement('script');
                script.src = 'assets/js/pages/menu.js';
                script.onerror = () => {
                    console.error('Failed to load menu.js');
                    $('#main-content').html('<div class="alert alert-danger">Failed to load menu component</div>');
                };
                document.body.appendChild(script);
            });
        },

        loadDefaultContent: function(path) {
            const componentPath = `components${path}.html`;
            $('#main-content').load(componentPath, function(response, status, xhr) {
                if (status === 'error') {
                    $('#main-content').html('<div class="alert alert-danger">Content not found</div>');
                }
            });
        },

        findMenuByPath: function(menus, path) {
            for (const menu of menus) {
                if (menu.url && (menu.url === path || menu.url === '/' + path)) {
                    return menu;
                }
                if (menu.children && menu.children.length > 0) {
                    const found = this.findMenuByPath(menu.children, path);
                    if (found) return found;
                }
            }
            return null;
        },

        updatePageHeader: function(menu) {
            // Update page title
            $('#page-title').text(menu.name);
            
            // Update breadcrumb
            const parentMenu = this.findParentMenu(JSON.parse(localStorage.getItem('menus')), menu.id);
            $('#breadcrumb-parent').text(parentMenu ? parentMenu.name : 'Home');
            $('#breadcrumb-current').text(menu.name);
            
            // Show/hide stats container
            $('#stats-container').toggle(menu.url === '/');
        },

        findParentMenu: function(menus, childId) {
            for (const menu of menus) {
                if (menu.children) {
                    for (const child of menu.children) {
                        if (child.id === childId) return menu;
                    }
                    const found = this.findParentMenu(menu.children, childId);
                    if (found) return found;
                }
            }
            return null;
        },

        loadDashboard: function() {
            $('#stats-container').show();
            $('#main-content').load('components/dashboard.html');
        }
    };
});