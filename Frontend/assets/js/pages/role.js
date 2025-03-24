import { vomoAPI } from '../api/index.js';

// Define RolePage
window.RolePage = class {
    constructor() {
        this.grid = null;
        this.permissionCategories = new Map();
        this.selectedPermissions = new Set();
        this.currentRole = null;
        this.allPermissions = [];
        this.permissionFilter = '';
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();
    }

    dispose() {
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
        // Clean up event listeners
        $('#addRoleBtn').off('click');
        $('#roleSearchBox').off('input');
        $('#permissionModal').off('shown.bs.modal hidden.bs.modal');
        $('#savePermissions').off('click');
        $('.select-all-category').off('click');
        $('#permissionSearchBox').off('input');
    }

    bindEvents() {
        // Add role button
        $('#addRoleBtn').on('click', () => {
            this.grid.addRow();
        });

        // Search box
        $('#roleSearchBox').on('input', (e) => {
            const searchText = e.target.value;
            this.grid.searchByText(searchText);
        });

        // Permission modal events
        $('#permissionModal').on('shown.bs.modal', () => {
            this.renderPermissionCategories();
            // Clear search box when modal opens
            $('#permissionSearchBox').val('');
            this.permissionFilter = '';
        });

        $('#permissionModal').on('hidden.bs.modal', () => {
            this.selectedPermissions.clear();
            this.currentRole = null;
            this.permissionFilter = '';
        });

        $('#savePermissions').on('click', () => {
            this.savePermissions();
        });

        // Permission search box
        $('#permissionSearchBox').on('input', (e) => {
            this.permissionFilter = e.target.value.toLowerCase();
            this.renderPermissionCategories();
        });

        // Category select all functionality
        $(document).on('click', '.select-all-category', (e) => {
            const category = $(e.currentTarget).data('category');
            const isChecked = $(e.currentTarget).prop('checked');
            const categoryPermissions = this.allPermissions.filter(p => 
                this.getPermissionCategory(p.name) === category
            );
            
            categoryPermissions.forEach(permission => {
                if (isChecked) {
                    this.selectedPermissions.add(permission.id);
                } else {
                    this.selectedPermissions.delete(permission.id);
                }
            });
            
            this.renderPermissionCategories();
        });
    }

    initialize() {
        const gridElement = $('#roleGrid');
        if (!gridElement.length) {
            console.error('Role grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#roleGrid').dxDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: []
                }
            },
            remoteOperations: false,
            columns: [
                {
                    dataField: 'name',
                    caption: 'Role Name',
                    validationRules: [{ type: 'required' }]
                },
                {
                    dataField: 'description',
                    caption: 'Description'
                },
                {
                    dataField: 'permissions',
                    caption: 'Permissions',
                    allowFiltering: false,
                    cellTemplate: (container, options) => {
                        if (!options.value || options.value.length === 0) {
                            $('<div>')
                                .addClass('text-muted font-italic')
                                .text('No permissions assigned')
                                .appendTo(container);
                            return;
                        }

                        const $container = $('<div>').addClass('permission-container');
                        
                        // Group permissions by category
                        const groupedPermissions = this.groupPermissionsByCategory(options.value);
                        
                        // Create category sections
                        Object.entries(groupedPermissions).forEach(([category, permissions]) => {
                            const $categoryContainer = $('<div>').addClass('mb-2');
                            $('<small>')
                                .addClass('text-muted d-block mb-1')
                                .text(category)
                                .appendTo($categoryContainer);
                            
                            permissions.forEach(permission => {
                                $('<span>')
                                    .addClass('permission-badge')
                                    .text(permission.name)
                                    .appendTo($categoryContainer);
                            });
                            
                            $container.append($categoryContainer);
                        });
                        
                        container.append($container);
                    }
                },
                {
                    type: 'buttons',
                    width: 110,
                    buttons: [
                        {
                            hint: 'Manage Permissions',
                            icon: 'key',
                            onClick: (e) => {
                                this.currentRole = e.row.data;
                                this.selectedPermissions = new Set(e.row.data.permissions.map(p => p.id));
                                $('#permissionModal').modal('show');
                            }
                        },
                        'edit',
                        'delete'
                    ]
                }
            ],
            showBorders: true,
            filterRow: { visible: true },
            searchPanel: { visible: false },
            headerFilter: { visible: true },
            editing: {
                mode: 'popup',
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true,
                popup: {
                    title: 'Role Information',
                    showTitle: true,
                    width: 700,
                    height: 325
                },
                form: {
                    items: [
                        {
                            itemType: 'group',
                            colCount: 1,
                            items: [
                                {
                                    dataField: 'name',
                                    isRequired: true
                                },
                                {
                                    dataField: 'description',
                                    editorType: 'dxTextArea',
                                    editorOptions: {
                                        height: 100
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            onInitialized: () => this.loadData(),
            onRowInserting: (e) => this.handleRowInserting(e),
            onRowUpdating: (e) => this.handleRowUpdating(e),
            onRowRemoving: (e) => this.handleRowRemoving(e)
        }).dxDataGrid('instance');
    }

    groupPermissionsByCategory(permissions) {
        const grouped = {};
        permissions.forEach(permission => {
            const category = this.getPermissionCategory(permission.name);
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(permission);
        });
        return grouped;
    }

    getPermissionCategory(permissionName) {
        const categories = {
            'Permission': ['View Permissions', 'Manage Permissions'],
            'Role': ['View Roles', 'Manage Roles', 'Delete Roles'],
            'User': ['View Users', 'Manage Users', 'Delete Users'],
            'Menu': ['View Menus', 'Manage Menus'],
            'Zone': ['View Zones', 'Manage Zones', 'Delete Zones'],
            'Order': ['View Orders', 'Create Orders', 'Update Orders', 'Delete Orders', 'Approve Orders'],
            'Payment': ['View Payments', 'Process Payments', 'Cancel Payments'],
            'Task': ['View Tasks', 'Manage Tasks', 'Delete Tasks'],
            'Finance': ['View Cash Flow', 'Manage Cash Flow', 'View Petty Cash', 'Create Petty Cash', 'Approve Petty Cash']
        };

        for (const [category, permissions] of Object.entries(categories)) {
            if (permissions.includes(permissionName)) {
                return category;
            }
        }
        return 'Other';
    }

    renderPermissionCategories() {
        this.allPermissions = this.getAllPermissions();
        const $categories = $('.permission-categories').empty();
        const $permissionList = $('.permission-list').empty();
        
        // Filter permissions based on search
        const filteredPermissions = this.allPermissions.filter(permission => {
            if (!this.permissionFilter) return true;
            return (
                permission.name.toLowerCase().includes(this.permissionFilter) ||
                permission.description.toLowerCase().includes(this.permissionFilter)
            );
        });
        
        // Group permissions by category
        const groupedPermissions = {};
        filteredPermissions.forEach(permission => {
            const category = this.getPermissionCategory(permission.name);
            if (!groupedPermissions[category]) {
                groupedPermissions[category] = [];
            }
            groupedPermissions[category].push(permission);
        });

        // Only show categories that have matching permissions
        Object.entries(groupedPermissions)
            .filter(([_, permissions]) => permissions.length > 0)
            .forEach(([category, permissions]) => {
                const $categoryGroup = $('<div>').addClass('category-group mb-3');
                
                // Add category header with select all checkbox
                const $header = $('<div>').addClass('category-header d-flex align-items-center mb-2');
                const $checkbox = $('<div>').addClass('custom-control custom-checkbox mr-3');
                const $input = $('<input>')
                    .addClass('custom-control-input select-all-category')
                    .attr({
                        type: 'checkbox',
                        id: `category-${category}`,
                        'data-category': category
                    });
                const $label = $('<label>')
                    .addClass('custom-control-label')
                    .attr('for', `category-${category}`)
                    .text(`${category} (${permissions.length})`);
                
                $checkbox.append($input, $label);
                $header.append($checkbox);
                $categoryGroup.append($header);

                // Add permissions for this category
                const $permissionsContainer = $('<div>').addClass('ml-4');
                permissions.forEach(permission => {
                    const $item = this.createPermissionItem(permission);
                    $permissionsContainer.append($item);
                });
                
                $categoryGroup.append($permissionsContainer);
                $permissionList.append($categoryGroup);
            });

        // Show "no results" message if no permissions match the filter
        if (Object.keys(groupedPermissions).length === 0) {
            $permissionList.append(
                $('<div>')
                    .addClass('text-center text-muted p-4')
                    .text('No permissions match your search')
            );
        }

        // Update select all checkboxes state
        this.updateSelectAllCheckboxes();
    }

    createPermissionItem(permission) {
        const $item = $('<div>').addClass('permission-item');
        
        const $checkbox = $('<div>').addClass('custom-control custom-checkbox');
        const $input = $('<input>')
            .addClass('custom-control-input')
            .attr({
                type: 'checkbox',
                id: `permission-${permission.id}`,
                checked: this.selectedPermissions.has(permission.id)
            })
            .on('change', (e) => {
                if (e.target.checked) {
                    this.selectedPermissions.add(permission.id);
                } else {
                    this.selectedPermissions.delete(permission.id);
                }
                this.updateSelectAllCheckboxes();
            });
        
        const $label = $('<label>')
            .addClass('custom-control-label')
            .attr('for', `permission-${permission.id}`);
        
        $checkbox.append($input, $label);
        
        const $info = $('<div>').addClass('permission-info');
        const $name = $('<div>').addClass('permission-name');
        const $description = $('<div>').addClass('permission-description');

        // Highlight matching text if there's a filter
        if (this.permissionFilter) {
            $name.html(this.highlightText(permission.name, this.permissionFilter));
            $description.html(this.highlightText(permission.description, this.permissionFilter));
        } else {
            $name.text(permission.name);
            $description.text(permission.description);
        }

        $info.append($name, $description);
        $item.append($checkbox, $info);
        return $item;
    }

    highlightText(text, filter) {
        if (!filter) return text;
        const regex = new RegExp(`(${filter})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    updateSelectAllCheckboxes() {
        const groupedPermissions = this.groupPermissionsByCategory(this.allPermissions);
        
        Object.entries(groupedPermissions).forEach(([category, permissions]) => {
            const categoryPermissionIds = new Set(permissions.map(p => p.id));
            const selectedCategoryPermissions = new Set(
                [...this.selectedPermissions].filter(id => categoryPermissionIds.has(id))
            );
            
            const $checkbox = $(`.select-all-category[data-category="${category}"]`);
            $checkbox.prop('checked', selectedCategoryPermissions.size === permissions.length);
            $checkbox.prop('indeterminate', 
                selectedCategoryPermissions.size > 0 && 
                selectedCategoryPermissions.size < permissions.length
            );
        });
    }

    getAllPermissions() {
        // Get all unique permissions from the roles
        const permissions = new Set();
        const data = this.grid.getDataSource().items();
        data.forEach(role => {
            if (role.permissions) {
                role.permissions.forEach(permission => {
                    permissions.add(JSON.stringify(permission));
                });
            }
        });
        return Array.from(permissions).map(p => JSON.parse(p));
    }

    async savePermissions() {
        if (!this.currentRole) return;

        try {
            const permissions = this.allPermissions
                .filter(p => this.selectedPermissions.has(p.id));

            await vomoAPI.updateRole(this.currentRole.id, {
                ...this.currentRole,
                permissions
            });

            // Update grid data
            const dataSource = this.grid.getDataSource();
            const items = dataSource.items();
            const index = items.findIndex(item => item.id === this.currentRole.id);
            if (index !== -1) {
                items[index].permissions = permissions;
                dataSource.reload();
            }

            $('#permissionModal').modal('hide');
            DevExpress.ui.notify('Permissions updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error saving permissions:', error);
            DevExpress.ui.notify('Failed to update permissions', 'error', 3000);
        }
    }

    async loadData() {
        try {
            const data = await vomoAPI.getRoles();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading roles:', error);
            DevExpress.ui.notify('Failed to load roles', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createRole(e.data);
            e.data.id = result.id;
            DevExpress.ui.notify('Role created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating role:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to create role', 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateRole(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Role updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating role:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update role', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteRole(e.key.id);
            DevExpress.ui.notify('Role deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting role:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete role', 'error', 3000);
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.rolePageInstance) {
    window.rolePageInstance = new window.RolePage();
} 