import { vomoAPI } from '../api/index.js';

// Define MenuPage
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

        const iconLookup = [
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
        ];

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
                        dataSource: iconLookup,
                        valueExpr: 'id',
                        displayExpr: 'text'
                    },
                    cellTemplate: (container, options) => {
                        if (!options.value) return;
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>')
                                    .addClass(options.value)
                                    .css({ 'font-size': '1.2em', 'margin-right': '8px' })
                            )
                            .append(
                                $('<span>').text(
                                    iconLookup.find(item => item.id === options.value)?.text || options.value
                                )
                            )
                            .appendTo(container);
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
                                        dataSource: iconLookup,
                                        valueExpr: 'id',
                                        displayExpr: 'text'
                                    },
                                    cellTemplate: (container, options) => {
                                        if (!options.value) return;
                                        $('<div>')
                                            .addClass('d-flex align-items-center')
                                            .append(
                                                $('<i>')
                                                    .addClass(options.value)
                                                    .css({ 'font-size': '1.2em', 'margin-right': '8px' })
                                            )
                                            .append(
                                                $('<span>').text(
                                                    iconLookup.find(item => item.id === options.value)?.text || options.value
                                                )
                                            )
                                            .appendTo(container);
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
    }

    async loadData() {
        try {
            const data = await vomoAPI.getMenus();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading menus:', error);
            DevExpress.ui.notify('Failed to load menus', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createMenu(e.data);
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
            await vomoAPI.updateMenu(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Menu updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating menu:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update menu', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteMenu(e.key.id);
            DevExpress.ui.notify('Menu deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting menu:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete menu', 'error', 3000);
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.menuPageInstance) {
    window.menuPageInstance = new window.MenuPage();
}