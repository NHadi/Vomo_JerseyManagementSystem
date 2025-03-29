import { vomoAPI } from '../api/index.js';
import { gridUtils } from '../utils/gridUtils.js';

// Define PermissionPage
window.PermissionPage = class {
    constructor() {
        this.grid = null;
        this.exportButtonsAdded = false;
        
        // Initialize components
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

    initialize() {
        const gridElement = $('#permissionGrid');
        if (!gridElement.length) {
            console.error('Permission grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#permissionGrid').dxDataGrid({
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
                    caption: 'Permission Name',
                    validationRules: [{ type: 'required' }]
                },
                {
                    dataField: 'description',
                    caption: 'Description',
                    editorType: 'dxTextArea',
                    editorOptions: {
                        height: 100
                    }
                },
                {
                    type: 'buttons',
                    width: 140,
                    alignment: 'center',
                    cellTemplate: (container, options) => {
                        const $buttonContainer = $('<div>')
                            .addClass('d-flex justify-content-end align-items-center');

                        // Edit Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-info mr-2')
                            .attr('title', 'Edit Permission')
                            .append($('<i>').addClass('fas fa-edit'))
                            .on('click', () => {
                                this.grid.editRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        // Delete Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-danger')
                            .attr('title', 'Delete Permission')
                            .append($('<i>').addClass('fas fa-trash'))
                            .on('click', () => {
                                this.grid.deleteRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        container.append($buttonContainer);
                    }
                }
            ],
            showBorders: true,
            filterRow: { visible: true },
            searchPanel: { visible: true },
            headerFilter: { visible: true },
            groupPanel: { visible: true },
            columnChooser: { enabled: false },
            toolbar: {
                items: [
                    {
                        location: 'before',
                        widget: 'dxButton',
                        options: {
                            icon: 'plus',
                            text: 'Add Permission',
                            onClick: () => this.grid.addRow()
                        }
                    },
                    'searchPanel',
                    'columnChooserButton'
                ]
            },
            editing: {
                mode: 'popup',
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true,
                popup: {
                    title: 'Permission Information',
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
            onContentReady: (e) => {
                // Add export buttons after grid is fully loaded
                if (this.grid && !this.exportButtonsAdded) {
                    gridUtils.addExportButtons(this.grid, 'Permissions');
                    this.exportButtonsAdded = true;
                }
            },
            onInitialized: () => {
                if (this.grid) {
                    this.loadData();
                }
            },
            onRowInserting: (e) => this.handleRowInserting(e),
            onRowUpdating: (e) => this.handleRowUpdating(e),
            onRowRemoving: (e) => this.handleRowRemoving(e)
        }).dxDataGrid('instance');
    }

    async loadData() {
        try {
            if (!this.grid) {
                console.warn('Grid instance is not available');
                return;
            }

            // Show loading panel
            this.grid.beginCustomLoading('Loading permissions...');
            
            const data = await vomoAPI.getPermissions();
            this.grid.option('dataSource', data);
            
            // Hide loading panel
            this.grid.endCustomLoading();
        } catch (error) {
            gridUtils.handleGridError(error, 'loading permissions');
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createPermission(e.data);
            e.data.id = result.id;
            gridUtils.showSuccess('Permission created successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'creating permission');
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updatePermission(e.key.id, {...e.oldData, ...e.newData});
            gridUtils.showSuccess('Permission updated successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'updating permission');
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deletePermission(e.key.id);
            gridUtils.showSuccess('Permission deleted successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'deleting permission');
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.permissionPageInstance) {
    window.permissionPageInstance = new window.PermissionPage();
} 