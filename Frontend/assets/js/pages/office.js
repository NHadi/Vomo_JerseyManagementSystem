import { vomoAPI } from '../api/index.js';
import { gridUtils } from '../utils/gridUtils.js';

// Define OfficePage
window.OfficePage = class {
    constructor() {
        this.grid = null;
        this.selectedZone = null;
        this.currentOffice = null;
        this.allZones = [];
        this.zoneFilter = '';
        this.exportButtonsAdded = false;
        
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
        $('#zoneModal').on('show.bs.modal', (e) => {
            const button = $(e.relatedTarget);
            this.currentOffice = {
                id: button.data('office-id'),
                name: button.data('office-name')
            };
            this.loadZones();
            
            // Update modal title to include office name
            const modal = $(e.target);
            modal.find('.modal-title').html(`
                <i class="ni ni-map-big mr-2"></i>
                Manage Zone - ${this.currentOffice.name}
            `);
        });

        // Modal hide event
        $('#zoneModal').on('hide.bs.modal', () => {
            this.selectedZone = null;
            this.currentOffice = null;
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
            ...gridUtils.getCommonGridConfig(),
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
                    confirmDeleteMessage: 'Are you sure you want to delete this office?'
                },
                popup: {
                    title: 'Office Information',
                    showTitle: true,
                    width: 700,
                    height: 525,
                    position: { my: 'center', at: 'center', of: window },
                    showCloseButton: true,
                    toolbarItems: [{
                        toolbar: 'bottom',
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            text: 'Save',
                            type: 'success',
                            stylingMode: 'contained',
                            onClick: function(e) {
                                const grid = $('#officeGrid').dxDataGrid('instance');
                                grid.saveEditData();
                            }
                        }
                    }, {
                        toolbar: 'bottom',
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            text: 'Cancel',
                            stylingMode: 'outlined',
                            onClick: function(e) {
                                const grid = $('#officeGrid').dxDataGrid('instance');
                                grid.cancelEditData();
                            }
                        }
                    }]
                },
                form: {
                    labelLocation: 'top',
                    colCount: 1,
                    items: [
                        {
                            itemType: 'group',
                            caption: 'Basic Information',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'name',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter office name',
                                    },
                                    validationRules: [{ 
                                        type: 'required',
                                        message: 'Office name is required'
                                    }]
                                },
                                {
                                    dataField: 'code',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter office code',
                                    },
                                    validationRules: [{ 
                                        type: 'required',
                                        message: 'Office code is required'
                                    }]
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Contact Information',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'email',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter email address',
                                    },
                                    validationRules: [
                                        { 
                                            type: 'required',
                                            message: 'Email is required'
                                        },
                                        {
                                            type: 'email',
                                            message: 'Invalid email format'
                                        }
                                    ]
                                },
                                {
                                    dataField: 'phone',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter phone number',
                                        mask: '+99 (999) 999-9999',
                                        maskRules: {
                                            "9": /[0-9]/
                                        },
                                        maskInvalidMessage: 'Please enter a valid phone number'
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Location',
                            items: [{
                                dataField: 'address',
                                editorType: 'dxTextArea',
                                editorOptions: {
                                    stylingMode: 'filled',
                                    placeholder: 'Enter office address',
                                    height: 100,
                                    maxLength: 500,
                                    spellcheck: true
                                }
                            }]
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
            onContentReady: (e) => {
                // Add export buttons after grid is fully loaded
                if (this.grid && !this.exportButtonsAdded) {
                    gridUtils.addExportButtons(this.grid, 'Office_List');
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
            this.grid.beginCustomLoading('Loading offices...');
            
            const data = await vomoAPI.getOffices();
            this.grid.option('dataSource', data);
            
            // Hide loading panel
            this.grid.endCustomLoading();
        } catch (error) {
            gridUtils.handleGridError(error, 'loading offices');
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
            gridUtils.showSuccess('Zone assigned successfully');
        } catch (error) {
            gridUtils.handleGridError(error, 'assigning zone');
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createOffice(e.data);
            e.data.id = result.id;
            gridUtils.showSuccess('Office created successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'creating office');
        }
    }

    async handleRowUpdating(e) {
        try {
            const { zone, ...updatedData } = { ...e.oldData, ...e.newData };
            const officeId = typeof e.key === 'object' ? e.key.id : e.key;
            await vomoAPI.updateOffice(officeId, updatedData);
            gridUtils.showSuccess('Office updated successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'updating office');
        }
    }

    async handleRowRemoving(e) {
        try {
            const officeId = typeof e.key === 'object' ? e.key.id : e.key;
            await vomoAPI.deleteOffice(officeId);
            gridUtils.showSuccess('Office deleted successfully');
        } catch (error) {
            e.cancel = true;
            gridUtils.handleGridError(error, 'deleting office');
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