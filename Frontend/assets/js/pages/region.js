import { vomoAPI } from '../api/index.js';

// Define RegionPage
window.RegionPage = class {
    constructor() {
        this.grid = null;
        this.selectedZones = new Set();
        this.currentRegion = null;
        this.allZones = [];
        this.zoneFilter = '';
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();
    }

    dispose() {
        // Clean up event listeners
        $('#zoneModal').off('show.bs.modal');
        $('#zoneModal').off('hide.bs.modal');
        $('#zoneSearchBox').off('input');
        $('#saveZones').off('click');

        // Dispose of the grid
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
    }

    bindEvents() {
        // Modal show event
        $('#zoneModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const regionId = button.data('region-id');
            const regionName = button.data('region-name');
            this.currentRegion = { id: regionId, name: regionName };
            this.loadZones(regionId);
        });

        // Modal hide event
        $('#zoneModal').on('hide.bs.modal', () => {
            this.selectedZones.clear();
            this.zoneFilter = '';
            $('#zoneSearchBox').val('');
            $('.zone-list').empty();
        });

        // Zone search
        $('#zoneSearchBox').on('input', (e) => {
            this.zoneFilter = e.target.value.toLowerCase();
            this.renderZones();
        });

        // Save zones
        $('#saveZones').on('click', () => this.saveZones());
    }

    initialize() {
        const gridElement = $('#regionGrid');
        if (!gridElement.length) {
            console.error('Region grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#regionGrid').dxDataGrid({
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
                    caption: 'Region Name',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>').addClass('ni ni-map-big mr-2 text-primary')
                            )
                            .append(
                                $('<span>').text(options.data.name || '')
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'description',
                    caption: 'Description',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('text-muted small')
                            .text(options.data.description || 'No description provided')
                            .appendTo(container);
                    }
                },             
                {
                    dataField: 'zones',
                    caption: 'Zones',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: (container, options) => {
                        const $container = $('<div>').addClass('zone-container');
                        
                        if (options.data.zones?.length) {
                            options.data.zones.forEach(zone => {
                                $('<span>')
                                    .addClass('zone-badge')
                                    .append(
                                        $('<i>').addClass('fas fa-map-marker-alt')
                                    )
                                    .append(
                                        $('<span>').text(' ' + zone.name)
                                    )
                                    .appendTo($container);
                            });
                        } else {
                            $('<div>')
                                .addClass('text-muted small')
                                .append(
                                    $('<i>').addClass('fas fa-info-circle mr-1')
                                )
                                .append(
                                    $('<span>').text('No zones assigned')
                                )
                                .appendTo($container);
                        }
                        
                        $container.appendTo(container);
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
                            .attr('title', 'Edit Region')
                            .append($('<i>').addClass('fas fa-edit'))
                            .on('click', () => {
                                this.grid.editRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        // Delete Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-danger')
                            .attr('title', 'Delete Region')
                            .append($('<i>').addClass('fas fa-trash'))
                            .on('click', () => {
                                DevExpress.ui.dialog.confirm("Are you sure you want to delete this region?", "Confirm deletion")
                                    .then((result) => {
                                        if (result) {
                                            this.grid.deleteRow(options.rowIndex);
                                        }
                                    });
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
            groupPanel: { visible: false },
            columnChooser: { enabled: false },
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20],
                showInfo: true,
                showNavigationButtons: true
            },
            editing: {
                mode: 'popup',
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true,
                useIcons: true,
                texts: {
                    confirmDeleteMessage: 'Are you sure you want to delete this region?'
                },
                popup: {
                    title: 'Region Information',
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
                                    validationRules: [{ type: 'required', message: 'Region name is required' }]
                                },
                                {
                                    dataField: 'description',
                                    editorType: 'dxTextArea',
                                    editorOptions: {
                                        height: 100
                                    },
                                    validationRules: [{ type: 'required', message: 'Description is required' }]
                                }
                            ]
                        }
                    ]
                }
            },
            toolbar: {
                items: [
                    {
                        location: 'before',
                        widget: 'dxButton',
                        options: {
                            icon: 'plus',
                            text: 'Add Region',
                            onClick: () => this.grid.addRow()
                        }
                    },
                    'searchPanel',
                    'columnChooserButton'
                ]
            },
            onRowInserting: (e) => this.handleRowInserting(e),
            onRowUpdating: (e) => this.handleRowUpdating(e),
            onRowRemoving: (e) => this.handleRowRemoving(e),
            onInitialized: () => this.loadData()
        }).dxDataGrid('instance');
    }

    async loadData() {
        try {
            const data = await vomoAPI.getRegions();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading regions:', error);
            DevExpress.ui.notify('Failed to load regions', 'error', 3000);
        }
    }

    async loadZones(regionId) {
        try {
            this.allZones = await vomoAPI.getZones();
            this.renderZones();
        } catch (error) {
            console.error('Error loading zones:', error);
            DevExpress.ui.notify('Failed to load zones', 'error', 3000);
        }
    }

    renderZones() {
        const $zoneList = $('.zone-list');
        $zoneList.empty();

        const filteredZones = this.allZones.filter(zone => 
            zone.name.toLowerCase().includes(this.zoneFilter) ||
            zone.description?.toLowerCase().includes(this.zoneFilter)
        );

        if (filteredZones.length === 0) {
            $zoneList.html(`
                <div class="no-zones">
                    <i class="fas fa-search"></i>
                    No zones found matching your search
                </div>
            `);
            return;
        }

        filteredZones.forEach(zone => {
            const isSelected = this.selectedZones.has(zone.id);
            const $zoneItem = this.createZoneItem(zone, isSelected);
            $zoneList.append($zoneItem);
        });
    }

    createZoneItem(zone, isSelected) {
        return $(`
            <div class="zone-item ${isSelected ? 'selected' : ''}" data-zone-id="${zone.id}">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="zone-${zone.id}"
                           ${isSelected ? 'checked' : ''}>
                    <label class="custom-control-label" for="zone-${zone.id}"></label>
                </div>
                <div class="zone-info">
                    <div class="zone-name">${zone.name}</div>
                    <div class="zone-details">${zone.description || 'No description provided'}</div>
                </div>
            </div>
        `).on('change', (e) => {
            const checked = e.target.checked;
            if (checked) {
                this.selectedZones.add(zone.id);
            } else {
                this.selectedZones.delete(zone.id);
            }
        });
    }

    async saveZones() {
        try {
            await vomoAPI.assignZones(this.currentRegion.id, Array.from(this.selectedZones));
            $('#zoneModal').modal('hide');
            this.loadData();
            DevExpress.ui.notify('Zones assigned successfully', 'success', 3000);
        } catch (error) {
            console.error('Error saving zones:', error);
            DevExpress.ui.notify('Failed to assign zones', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createRegion(e.data);
            e.data.id = result.id;
            DevExpress.ui.notify('Region created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating region:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to create region', 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateRegion(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Region updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating region:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update region', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteRegion(e.key.id);
            DevExpress.ui.notify('Region deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting region:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete region', 'error', 3000);
        }
    }

    editRegion(region) {
        const rowIndex = this.grid.getRowIndexByKey(region.id);
        if (rowIndex >= 0) {
            this.grid.editRow(rowIndex);
        }
    }

    deleteRegion(region) {
        const rowIndex = this.grid.getRowIndexByKey(region.id);
        if (rowIndex >= 0) {
            DevExpress.ui.dialog.confirm("Are you sure you want to delete this region?", "Confirm deletion")
                .then((result) => {
                    if (result) {
                        this.grid.deleteRow(rowIndex);
                    }
                });
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.regionPageInstance) {
    window.regionPageInstance = new window.RegionPage();
} 