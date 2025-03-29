import { vomoAPI } from '../api/index.js';
import { gridUtils } from '../utils/gridUtils.js';

// Define MenuPage
window.MenuPage = class {
    constructor() {
        this.grid = null;
        this.exportButtonsAdded = false;
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
            ...gridUtils.getCommonGridConfig(),
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
            columnChooser: { enabled: false },
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
            onContentReady: (e) => {
                // Add export buttons after grid is fully loaded
                if (this.grid && !this.exportButtonsAdded) {
                    gridUtils.addExportButtons(this.grid, 'Menu_List');
                    this.exportButtonsAdded = true;
                }
            },
            onInitialized: () => {
                if (this.grid) {
                    this.loadData();
                }
            }
        }).dxDataGrid('instance');
    }

    async loadData() {
        try {
            if (!this.grid) {
                console.warn('Grid instance is not available');
                return;
            }

            // Show loading panel
            this.grid.beginCustomLoading('Loading menus...');
            
            const data = await vomoAPI.getMenus();
            this.grid.option('dataSource', data);
            
            // Hide loading panel
            this.grid.endCustomLoading();
        } catch (error) {
            gridUtils.handleGridError(error, 'loading menus');
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createMenu(e.data);
            e.data.id = result.id;
            gridUtils.showSuccess('Menu created successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'creating menu');
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateMenu(e.key.id, {...e.oldData, ...e.newData});
            gridUtils.showSuccess('Menu updated successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'updating menu');
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteMenu(e.key.id);
            gridUtils.showSuccess('Menu deleted successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'deleting menu');
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.menuPageInstance) {
    window.menuPageInstance = new window.MenuPage();
}