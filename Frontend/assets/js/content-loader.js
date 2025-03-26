// Create a self-executing function to avoid global scope pollution
(function() {
    // Store loaded scripts to prevent duplicate loading
    const loadedScripts = new Set();
    const loadedStyles = new Set();
    
    window.contentLoader = {
        currentPath: null,
        isLoading: false,
        
        clearContent: function() {
            // Clear all dynamic content areas
            $('#main-content').empty();
            $('#stats-container').hide();
            $('#page-actions').empty();
            // Reset page header to prevent stale data
            $('#page-title').text('');
            $('#breadcrumb-parent').text('');
            $('#breadcrumb-current').text('');
        },

        showError: function(message, path) {
            // Clear existing content first
            this.clearContent();
            
            // Update header with error state
            $('#page-title').text('Not Found');
            $('#breadcrumb-parent').text('Error');
            $('#breadcrumb-current').text('Page Not Found');
            
            // Show error message with more details
            $('#main-content').html(`
                <div class="container-fluid mt-4">
                    <div class="alert alert-danger" role="alert">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-exclamation-circle fa-2x mr-3"></i>
                            <div>
                                <h4 class="alert-heading mb-2">Component Not Found</h4>
                                <p class="mb-1">${message}</p>
                                <hr>
                                <div class="mt-3">
                                    <p class="mb-1"><strong>Possible solutions:</strong></p>
                                    <ul class="mb-0">
                                        <li>Check if the component file exists in the correct location</li>
                                        <li>Verify the path in your menu configuration</li>
                                        <li>Ensure the component name matches exactly</li>
                                    </ul>
                                </div>
                                <div class="mt-3">
                                    <a href="/" class="btn btn-outline-primary">
                                        <i class="fas fa-home mr-1"></i> Return to Dashboard
                                    </a>
                                    <button onclick="window.history.back()" class="btn btn-outline-secondary ml-2">
                                        <i class="fas fa-arrow-left mr-1"></i> Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        },

        loadContent: async function(path) {
            // If already loading, prevent duplicate load
            if (this.isLoading) {
                console.log('Already loading content, skipping');
                return;
            }
            
            // Set loading state
            this.isLoading = true;
            
            try {
                // Clean path and handle special cases
                path = (path || '').split('#')[0].replace(/^\/+|\/+$/g, '');
                if (path === 'index.html') {
                    path = '';
                }
                
                // Check authentication
                const token = localStorage.getItem('token');
                if (!token && path !== 'login') {
                    window.location.href = '/login.html';
                    return;
                }

                // Clear existing content before any loading attempt
                this.clearContent();

                // Find current menu and update header
                const menus = JSON.parse(localStorage.getItem('menus') || '[]');
                const currentMenu = path === '' ? { name: 'Dashboard', url: '/' } : this.findMenuByPath(menus, path);

                // Handle content loading based on path
                if (path === '' || path === '/') {
                    // Load dashboard
                    await this.loadDashboard();
                    this.updatePageHeader({ name: 'Dashboard', url: '/' });
                } else if (currentMenu) {
                    // Update header before loading content
                    this.updatePageHeader(currentMenu);
                    
                    // Load appropriate content
                    switch (path) {
                        case 'menu':
                            await this.loadMenuGrid();
                            break;
                        case 'audit':
                            await this.loadAuditGrid();
                            break;
                        case 'role':
                            await this.loadRoleGrid();
                            break;
                        case 'backup':
                            await this.loadBackupGrid();
                            break;
                        default:
                            try {
                                await this.loadDefaultContent('/' + path);
                            } catch (error) {
                                console.error('Content loading error:', error.message);
                                this.showError(`The page "${path}" could not be loaded: ${error.message}`, path);
                                return;
                            }
                    }
                } else {
                    // Show error for non-existent pages and return early
                    this.showError(`The page "${path}" is not available in your menu.`, path);
                    return;
                }
                
                // Only update current path if content was loaded successfully
                this.currentPath = path;
            } catch (error) {
                console.error('Error loading content:', error);
                this.showError('An error occurred while loading the page.', path);
            } finally {
                this.isLoading = false;
            }
        },

        loadScript: function(src) {
            return new Promise((resolve, reject) => {
                if (loadedScripts.has(src)) {
                    resolve();
                    return;
                }

                const existingScript = document.querySelector(`script[src="${src}"]`);
                if (existingScript) {
                    loadedScripts.add(src);
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loadedScripts.add(src);
                    resolve();
                };
                script.onerror = reject;
                document.body.appendChild(script);
            });
        },

        loadStyle: function(href) {
            return new Promise((resolve, reject) => {
                if (loadedStyles.has(href)) {
                    resolve();
                    return;
                }

                const existingLink = document.querySelector(`link[href="${href}"]`);
                if (existingLink) {
                    loadedStyles.add(href);
                    resolve();
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = () => {
                    loadedStyles.add(href);
                    resolve();
                };
                link.onerror = reject;
                document.head.appendChild(link);
            });
        },

        loadMenuGrid: async function() {
            // Only dispose if we're loading a new instance
            if (window.menuPageInstance) {
                window.menuPageInstance.dispose();
                window.menuPageInstance = null;
            }

            return new Promise((resolve, reject) => {
                $('#main-content').load('components/menu.html', async () => {
                    try {
                        // Wait for DevExtreme to load
                        await new Promise(resolve => {
                            const checkDevExtreme = () => {
                                if (typeof DevExpress !== 'undefined') {
                                    resolve();
                                } else {
                                    setTimeout(checkDevExtreme, 100);
                                }
                            };
                            checkDevExtreme();
                        });

                        // Remove any existing script
                        const existingScript = document.querySelector('script[data-page="menu"]');
                        if (existingScript) {
                            existingScript.remove();
                        }

                        // Create a script element with type="module" to load the menu.js module
                        const script = document.createElement('script');
                        script.type = 'module';
                        script.src = './assets/js/pages/menu.js';
                        script.setAttribute('data-page', 'menu');
                        
                        // Handle script load/error
                        script.onload = () => {
                            // Initialize the menu page instance
                            if (!window.menuPageInstance) {
                                window.menuPageInstance = new window.MenuPage();
                            }
                            resolve();
                        };
                        script.onerror = (error) => {
                            console.error('Failed to load menu module:', error);
                            reject(error);
                        };
                        
                        document.body.appendChild(script);
                    } catch (error) {
                        console.error('Failed to load menu component:', error);
                        $('#main-content').html('<div class="alert alert-danger">Failed to load menu component</div>');
                        reject(error);
                    }
                });
            });
        },

        loadAuditGrid: async function() {
            // Only dispose if we're loading a new instance
            if (window.auditPageInstance) {
                window.auditPageInstance.dispose();
                window.auditPageInstance = null;
            }

            return new Promise((resolve, reject) => {
                $('#main-content').load('components/audit.html', async () => {
                    try {
                        // Wait for DevExtreme to load
                        await new Promise(resolve => {
                            const checkDevExtreme = () => {
                                if (typeof DevExpress !== 'undefined') {
                                    resolve();
                                } else {
                                    setTimeout(checkDevExtreme, 100);
                                }
                            };
                            checkDevExtreme();
                        });

                        // Remove any existing script
                        const existingScript = document.querySelector('script[data-page="audit"]');
                        if (existingScript) {
                            existingScript.remove();
                        }

                        // Create a script element with type="module" to load the audit.js module
                        const script = document.createElement('script');
                        script.type = 'module';
                        script.src = './assets/js/pages/audit.js';
                        script.setAttribute('data-page', 'audit');
                        
                        // Handle script load/error
                        script.onload = () => {
                            // Initialize the audit page instance
                            if (!window.auditPageInstance) {
                                window.auditPageInstance = new window.AuditPage();
                            }
                            resolve();
                        };
                        script.onerror = (error) => {
                            console.error('Failed to load audit module:', error);
                            reject(error);
                        };
                        
                        document.body.appendChild(script);
                    } catch (error) {
                        console.error('Failed to load audit component:', error);
                        $('#main-content').html('<div class="alert alert-danger">Failed to load audit component</div>');
                        reject(error);
                    }
                });
            });
        },

        loadRoleGrid: async function() {
            // Only dispose if we're loading a new instance
            if (window.rolePageInstance) {
                window.rolePageInstance.dispose();
                window.rolePageInstance = null;
            }

            return new Promise((resolve, reject) => {
                $('#main-content').load('components/role.html', async () => {
                    try {
                        // Wait for DevExtreme to load
                        await new Promise(resolve => {
                            const checkDevExtreme = () => {
                                if (typeof DevExpress !== 'undefined') {
                                    resolve();
                                } else {
                                    setTimeout(checkDevExtreme, 100);
                                }
                            };
                            checkDevExtreme();
                        });

                        // Remove any existing script
                        const existingScript = document.querySelector('script[data-page="role"]');
                        if (existingScript) {
                            existingScript.remove();
                        }

                        // Create a script element with type="module" to load the role.js module
                        const script = document.createElement('script');
                        script.type = 'module';
                        script.src = './assets/js/pages/role.js';
                        script.setAttribute('data-page', 'role');
                        
                        // Handle script load/error
                        script.onload = () => {
                            // Initialize the role page instance
                            if (!window.rolePageInstance) {
                                window.rolePageInstance = new window.RolePage();
                            }
                            resolve();
                        };
                        script.onerror = (error) => {
                            console.error('Failed to load role module:', error);
                            reject(error);
                        };
                        
                        document.body.appendChild(script);
                    } catch (error) {
                        console.error('Failed to load role component:', error);
                        $('#main-content').html('<div class="alert alert-danger">Failed to load role component</div>');
                        reject(error);
                    }
                });
            });
        },

        loadBackupGrid: async function() {
            // Only dispose if we're loading a new instance
            if (window.backupPageInstance) {
                window.backupPageInstance.dispose();
                window.backupPageInstance = null;
            }

            return new Promise((resolve, reject) => {
                $('#main-content').load('components/backup.html', async () => {
                    try {
                        // Wait for DevExtreme to load
                        await new Promise(resolve => {
                            const checkDevExtreme = () => {
                                if (typeof DevExpress !== 'undefined') {
                                    resolve();
                                } else {
                                    setTimeout(checkDevExtreme, 100);
                                }
                            };
                            checkDevExtreme();
                        });

                        // Remove any existing script
                        const existingScript = document.querySelector('script[data-page="backup"]');
                        if (existingScript) {
                            existingScript.remove();
                        }

                        // Create a script element with type="module" to load the backup.js module
                        const script = document.createElement('script');
                        script.type = 'module';
                        script.src = './assets/js/pages/backup.js';
                        script.setAttribute('data-page', 'backup');
                        
                        // Handle script load/error
                        script.onload = () => {
                            // Initialize the backup page instance
                            if (!window.backupPageInstance) {
                                window.backupPageInstance = new window.BackupPage();
                            }
                            resolve();
                        };
                        script.onerror = (error) => {
                            console.error('Failed to load backup module:', error);
                            reject(error);
                        };
                        
                        document.body.appendChild(script);
                    } catch (error) {
                        console.error('Failed to load backup component:', error);
                        $('#main-content').html('<div class="alert alert-danger">Failed to load backup component</div>');
                        reject(error);
                    }
                });
            });
        },

        loadDefaultContent: function(path) {
            return new Promise((resolve, reject) => {
                const componentPath = `components${path}.html`;
                console.log('Loading component:', componentPath);
                
                fetch(componentPath)
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 404) {
                                throw new Error(`The component "${path}" could not be found. Please check the file path: ${componentPath}`);
                            }
                            throw new Error(`Failed to load component (${response.status}): ${componentPath}`);
                        }
                        return response.text();
                    })
                    .then(content => {
                        // Check if content is empty or just whitespace
                        if (!content || !content.trim()) {
                            throw new Error(`The component file "${componentPath}" exists but appears to be empty.`);
                        }

                        // Content looks valid, load it into the DOM
                        $('#main-content').html(content);
                        resolve();
                    })
                    .catch(error => {
                        console.error('Failed to load component:', error);
                        reject(error);
                    });
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
            return new Promise((resolve) => {
                // Show stats container first to prevent flashing
                $('#stats-container').show();
                
                // Load dashboard content
                $('#main-content').load('components/dashboard.html', () => {
                    resolve();
                });
            });
        }
    };
})();