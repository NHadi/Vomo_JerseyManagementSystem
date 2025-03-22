// Define MenuPage only if it hasn't been defined yet
if (typeof window.MenuPage === 'undefined') {
    window.MenuPage = class {
        constructor() {
            this.grid = null;
            // Check if DevExtreme is already loaded
            if (typeof DevExpress !== 'undefined') {
                this.initialize();
            }
        }

        dispose() {
            if (this.grid) {
                this.grid.dispose();
                this.grid = null;
            }
        }

        initializeDevExtreme() {
            // Load DevExtreme if not available
            if (typeof DevExpress === 'undefined') {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://cdn3.devexpress.com/jslib/23.1.3/css/dx.light.css';
                document.head.appendChild(cssLink);

                const script = document.createElement('script');
                script.src = 'https://cdn3.devexpress.com/jslib/23.1.3/js/dx.all.js';
                script.onload = () => this.initialize();
                document.head.appendChild(script);
            } else {
                this.initialize();
            }
        }

        initialize() {
            // Ensure the grid element exists
            const gridElement = $('#menuGrid');
            if (!gridElement.length) {
                console.error('Menu grid element not found');
                return;
            }

            // Dispose of existing grid instance if any
            if (this.grid) {
                this.grid.dispose();
            }

            const token = localStorage.getItem('token');
            const tenantId = localStorage.getItem('tenant_id');

            this.grid = $('#menuGrid').dxDataGrid({
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
                        caption: 'Menu Name',
                        validationRules: [{ type: 'required' }]
                    },
                    {
                        dataField: 'url',
                        caption: 'URL'
                    },
                    {
                        dataField: 'icon',
                        caption: 'Icon',
                        lookup: {
                            dataSource: [
                                { id: 'ni ni-settings', text: 'Settings' },
                                { id: 'ni ni-archive-2', text: 'Archive' },
                                { id: 'ni ni-cart', text: 'Cart' },
                                { id: 'ni ni-box-2', text: 'Box' },
                                { id: 'ni ni-money-coins', text: 'Money' },
                                { id: 'ni ni-tag', text: 'Tag' },
                                { id: 'ni ni-collection', text: 'Collection' },
                                { id: 'ni ni-world-2', text: 'World' },
                                { id: 'ni ni-building', text: 'Building' },
                                { id: 'ni ni-map-big', text: 'Map' },
                                { id: 'ni ni-circle-08', text: 'User' }
                            ],
                            valueExpr: 'id',
                            displayExpr: 'text'
                        }
                    },
                    {
                        dataField: 'sort',
                        caption: 'Sort Order',
                        dataType: 'number'
                    }
                ],
                showBorders: true,
                filterRow: { visible: true },
                searchPanel: { visible: true },
                groupPanel: { visible: true },
                columnChooser: { enabled: true },
                headerFilter: { visible: true },
                masterDetail: {
                    enabled: true,
                    template: (container, options) => {
                        const currentItem = options.data;
                        if (!currentItem.children || currentItem.children.length === 0) {
                            container.append($('<div>').text('No sub-menus available'));
                            return;
                        }

                        $('<div>')
                            .dxDataGrid({
                                dataSource: currentItem.children,
                                columns: [
                                    {
                                        dataField: 'name',
                                        caption: 'Sub Menu Name',
                                        validationRules: [{ type: 'required' }]
                                    },
                                    {
                                        dataField: 'url',
                                        caption: 'URL'
                                    },
                                    {
                                        dataField: 'icon',
                                        caption: 'Icon',
                                        lookup: {
                                            dataSource: [
                                                { id: 'ni ni-settings', text: 'Settings' },
                                                { id: 'ni ni-archive-2', text: 'Archive' },
                                                { id: 'ni ni-cart', text: 'Cart' },
                                                { id: 'ni ni-box-2', text: 'Box' },
                                                { id: 'ni ni-money-coins', text: 'Money' },
                                                { id: 'ni ni-tag', text: 'Tag' },
                                                { id: 'ni ni-collection', text: 'Collection' },
                                                { id: 'ni ni-world-2', text: 'World' },
                                                { id: 'ni ni-building', text: 'Building' },
                                                { id: 'ni ni-map-big', text: 'Map' },
                                                { id: 'ni ni-circle-08', text: 'User' }
                                            ],
                                            valueExpr: 'id',
                                            displayExpr: 'text'
                                        }
                                    },
                                    {
                                        dataField: 'sort',
                                        caption: 'Sort Order',
                                        dataType: 'number'
                                    }
                                ],
                                showBorders: true,
                                editing: {
                                    mode: 'popup',
                                    allowUpdating: true,
                                    allowDeleting: true,
                                    allowAdding: true,
                                    popup: {
                                        title: 'Sub Menu Information',
                                        showTitle: true,
                                        width: 700,
                                        height: 525
                                    }
                                },
                                onRowInserting: (e) => {
                                    e.data.parent_id = currentItem.id;
                                    this.handleRowInserting(e);
                                },
                                onRowUpdating: (e) => this.handleRowUpdating(e),
                                onRowRemoving: (e) => this.handleRowRemoving(e)
                            }).appendTo(container);
                    }
                },
                editing: {
                    mode: 'popup',
                    allowUpdating: true,
                    allowDeleting: true,
                    allowAdding: true,
                    popup: {
                        title: 'Menu Information',
                        showTitle: true,
                        width: 700,
                        height: 525
                    }
                },
                onRowInserting: (e) => this.handleRowInserting(e),
                onRowUpdating: (e) => this.handleRowUpdating(e),
                onRowRemoving: (e) => this.handleRowRemoving(e),
                onInitialized: () => this.loadData()
            }).dxDataGrid('instance');

            // Load data after grid is initialized
            this.loadData();
        }

        async loadData() {
            try {
                const response = await fetch('http://localhost:8080/api/menus', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Tenant-ID': localStorage.getItem('tenant_id')
                    }
                });
                
                if (!response.ok) throw new Error('Failed to load menus');
                
                const data = await response.json();
                this.grid.option('dataSource', data);
            } catch (error) {
                console.error('Error loading menus:', error);
                DevExpress.ui.notify('Failed to load menus', 'error', 3000);
            }
        }

        async handleRowInserting(e) {
            try {
                const response = await fetch('http://localhost:8080/api/menus', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Tenant-ID': localStorage.getItem('tenant_id'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(e.data)
                });

                if (!response.ok) throw new Error('Failed to create menu');

                const result = await response.json();
                e.data.id = result.id;
                DevExpress.ui.notify('Menu created successfully', 'success', 3000);
            } catch (error) {
                console.error('Error creating menu:', error);
                e.cancel = true;
                DevExpress.ui.notify('Failed to create menu', 'error', 3000);
            }
        }

        async handleRowUpdating(e) {
            try {
                const response = await fetch(`http://localhost:8080/api/menus/${e.key.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Tenant-ID': localStorage.getItem('tenant_id'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...e.oldData, ...e.newData})
                });

                if (!response.ok) throw new Error('Failed to update menu');

                DevExpress.ui.notify('Menu updated successfully', 'success', 3000);
            } catch (error) {
                console.error('Error updating menu:', error);
                e.cancel = true;
                DevExpress.ui.notify('Failed to update menu', 'error', 3000);
            }
        }

        async handleRowRemoving(e) {
            try {
                const response = await fetch(`http://localhost:8080/api/menus/${e.key.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Tenant-ID': localStorage.getItem('tenant_id')
                    }
                });

                if (!response.ok) throw new Error('Failed to delete menu');

                DevExpress.ui.notify('Menu deleted successfully', 'success', 3000);
            } catch (error) {
                console.error('Error deleting menu:', error);
                e.cancel = true;
                DevExpress.ui.notify('Failed to delete menu', 'error', 3000);
            }
        }
    }
}

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.menuPageInstance) {
    window.menuPageInstance = new window.MenuPage();
}