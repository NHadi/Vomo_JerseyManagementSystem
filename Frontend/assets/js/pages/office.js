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
        $('#zoneModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const officeId = button.data('office-id');
            const officeName = button.data('office-name');
            this.currentOffice = { id: officeId, name: officeName };
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
                    validationRules: [{ type: 'required' }]
                },
                {
                    dataField: 'code',
                    caption: 'Office Code'
                },
                {
                    dataField: 'address',
                    caption: 'Address'
                },
                {
                    dataField: 'phone',
                    caption: 'Phone'
                },
                {
                    dataField: 'email',
                    caption: 'Email'
                },
                {
                    dataField: 'zone',
                    caption: 'Zone',
                    cellTemplate: (container, options) => {
                        const office = options.data;
                        container.innerHTML = `
                            <div class="zone-container">
                                ${office.zone ? `
                                    <span class="zone-badge">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${office.zone.name}
                                    </span>
                                ` : `
                                    <div class="text-muted small">
                                        <i class="fas fa-info-circle mr-1"></i>
                                        No zone assigned
                                    </div>
                                `}
                            </div>
                        `;
                    }
                },
                {
                    type: 'buttons',
                    width: 120,
                    buttons: [
                        {
                            icon: 'fas fa-map-marked-alt',
                            hint: 'Manage Zone',
                            onClick: (e) => {
                                const office = e.row.data;
                                $('#zoneModal').modal('show');
                            },
                            template: (container, options) => {
                                const office = options.row.data;
                                container.innerHTML = `
                                    <button class="btn btn-icon-only btn-primary" 
                                            data-office-id="${office.id}"
                                            data-office-name="${office.name}"
                                            title="Manage Zone">
                                        <i class="fas fa-map-marked-alt"></i>
                                    </button>
                                `;
                            }
                        },
                        {
                            icon: 'fas fa-edit',
                            hint: 'Edit Office',
                            onClick: (e) => {
                                const office = e.row.data;
                                this.editOffice(office);
                            },
                            template: (container, options) => {
                                const office = options.row.data;
                                container.innerHTML = `
                                    <button class="btn btn-icon-only btn-info" 
                                            title="Edit Office">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                `;
                            }
                        },
                        {
                            icon: 'fas fa-trash',
                            hint: 'Delete Office',
                            onClick: (e) => {
                                const office = e.row.data;
                                this.deleteOffice(office);
                            },
                            template: (container, options) => {
                                const office = options.row.data;
                                container.innerHTML = `
                                    <button class="btn btn-icon-only btn-danger" 
                                            title="Delete Office">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                `;
                            }
                        }
                    ]
                }
            ],
            showBorders: true,
            filterRow: { visible: true },
            searchPanel: { visible: true },
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20],
                showInfo: true,
                showNavigationButtons: true
            },
            onRowInserting: (e) => this.handleRowInserting(e),
            onRowUpdating: (e) => this.handleRowUpdating(e),
            onRowRemoving: (e) => this.handleRowRemoving(e)
        }).dxDataGrid('instance');

        this.loadData();
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
        `).on('change', (e) => {
            if (e.target.checked) {
                this.selectedZone = zone;
            }
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
            this.loadData();
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
            await vomoAPI.updateOffice(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Office updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating office:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update office', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteOffice(e.key.id);
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