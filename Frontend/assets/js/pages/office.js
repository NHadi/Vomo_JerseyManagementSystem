import { vomoAPI } from '../api/index.js';

// Define OfficePage
window.OfficePage = class {
    constructor() {
        this.grid = null;
        this.selectedZone = null;
        this.currentOffice = null;
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
        $('#saveZone').off('click');

        // Dispose of the grid
        if (this.grid) {
            this.grid.dispose();
        }
    }

    bindEvents() {
        // Modal show event
        $('#zoneModal').on('show.bs.modal', () => {
            this.loadZones();
        });

        // Modal hide event
        $('#zoneModal').on('hide.bs.modal', () => {
            this.selectedZone = null;
            this.zoneFilter = '';
            $('#zoneSearchBox').val('');
            $('.zone-list').empty();
        });

        // Zone search
        $('#zoneSearchBox').on('input', (e) => {
            this.zoneFilter = e.target.value.toLowerCase();
            this.renderZones();
        });

        // Save zone
        $('#saveZone').on('click', () => this.saveZone());
    }

    initialize() {
        const gridElement = $('#officeGrid');
        if (!gridElement.length) {
            console.error('Office grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#officeGrid').dxDataGrid({
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
                    caption: 'Office Name',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>').addClass('ni ni-building mr-2 text-primary')
                            )
                            .append(
                                $('<span>').text(options.data.name || '')
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'code',
                    caption: 'Office Code',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('text-muted small')
                            .text(options.data.code || '')
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'address',
                    caption: 'Address',
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('text-muted small')
                            .text(options.data.address || 'No address provided')
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'phone',
                    caption: 'Phone',
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('text-muted small')
                            .text(options.data.phone || 'No phone provided')
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'email',
                    caption: 'Email',
                    validationRules: [{ type: 'email' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('text-muted small')
                            .text(options.data.email || 'No email provided')
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'zone',
                    caption: 'Zone',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: (container, options) => {
                        const $container = $('<div>').addClass('zone-container');
                        
                        if (options.data.zone) {
                            $('<span>')
                                .addClass('zone-badge')
                                .append(
                                    $('<i>').addClass('fas fa-map-marker-alt')
                                )
                                .append(
                                    $('<span>').text(' ' + options.data.zone.name)
                                )
                                .attr('title', options.data.zone.description || '')
                                .appendTo($container);
                        } else {
                            $('<div>')
                                .addClass('text-muted small')
                                .append(
                                    $('<i>').addClass('fas fa-info-circle mr-1')
                                )
                                .append(
                                    $('<span>').text('No zone assigned')
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

                        // Manage Zone Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-primary mr-2')
                            .attr({
                                'title': 'Manage Zone',
                                'data-toggle': 'modal',
                                'data-target': '#zoneModal',
                                'data-office-id': options.row.data.id,
                                'data-office-name': options.row.data.name
                            })
                            .append($('<i>').addClass('fas fa-map-marked-alt'))
                            .appendTo($buttonContainer);

                        // Edit Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-info mr-2')
                            .attr('title', 'Edit Office')
                            .append($('<i>').addClass('fas fa-edit'))
                            .on('click', () => {
                                this.grid.editRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        // Delete Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-danger')
                            .attr('title', 'Delete Office')
                            .append($('<i>').addClass('fas fa-trash'))
                            .on('click', () => {
                                DevExpress.ui.dialog.confirm("Are you sure you want to delete this office?", "Confirm deletion")
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
            columnChooser: { enabled: true },
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
                    confirmDeleteMessage: 'Are you sure you want to delete this office?'
                },
                popup: {
                    title: 'Office Information',
                    showTitle: true,
                    width: 700,
                    height: 525
                },
                form: {
                    items: [
                        {
                            itemType: 'group',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'name',
                                    validationRules: [{ type: 'required', message: 'Office name is required' }]
                                },
                                {
                                    dataField: 'code',
                                    validationRules: [{ type: 'required', message: 'Office code is required' }]
                                },
                                {
                                    dataField: 'email',
                                    validationRules: [
                                        { type: 'required', message: 'Email is required' },
                                        { type: 'email', message: 'Invalid email format' }
                                    ]
                                },
                                {
                                    dataField: 'phone'
                                },
                                {
                                    dataField: 'address',
                                    editorType: 'dxTextArea',
                                    editorOptions: {
                                        height: 100
                                    },
                                    colSpan: 2
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
                            text: 'Add Office',
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
            const data = await vomoAPI.getOffices();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading offices:', error);
            DevExpress.ui.notify('Failed to load offices', 'error', 3000);
        }
    }

    async loadZones() {
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
            const isSelected = this.selectedZone?.id === zone.id;
            const $zoneItem = this.createZoneItem(zone, isSelected);
            $zoneList.append($zoneItem);
        });
    }

    createZoneItem(zone, isSelected) {
        return $(`
            <div class="zone-item ${isSelected ? 'selected' : ''}" data-zone-id="${zone.id}">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="zone-${zone.id}"
                           name="zone" ${isSelected ? 'checked' : ''}>
                    <label class="custom-control-label" for="zone-${zone.id}"></label>
                </div>
                <div class="zone-info">
                    <div class="zone-name">${zone.name}</div>
                    <div class="zone-details">${zone.description || 'No description provided'}</div>
                </div>
            </div>
        `).on('change', 'input[type="radio"]', () => {
            this.selectedZone = zone;
        });
    }

    async saveZone() {
        try {
            if (!this.selectedZone) {
                DevExpress.ui.notify('Please select a zone', 'warning', 3000);
                return;
            }

            await vomoAPI.assignZone(this.currentOffice.id, this.selectedZone.id);
            $('#zoneModal').modal('hide');
            await this.loadData();
            DevExpress.ui.notify('Zone assigned successfully', 'success', 3000);
        } catch (error) {
            console.error('Error saving zone:', error);
            DevExpress.ui.notify('Failed to assign zone', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createOffice(e.data);
            e.data.id = result.id;
            DevExpress.ui.notify('Office created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating office:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to create office', 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            const updatedData = { ...e.oldData, ...e.newData };
            await vomoAPI.updateOffice(e.key, updatedData);
            DevExpress.ui.notify('Office updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating office:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update office', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteOffice(e.key);
            DevExpress.ui.notify('Office deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting office:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete office', 'error', 3000);
        }
    }

    editOffice(office) {
        this.grid.editRow(this.grid.getRowElement(office.id));
    }

    deleteOffice(office) {
        this.grid.deleteRow(this.grid.getRowElement(office.id));
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.officePageInstance) {
    window.officePageInstance = new window.OfficePage();
} 