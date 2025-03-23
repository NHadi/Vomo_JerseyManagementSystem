// Define AuditPage only if it hasn't been defined yet
if (typeof window.AuditPage === 'undefined') {
    window.AuditPage = class {
        constructor() {
            this.grid = null;
            this.startDatePicker = null;
            this.endDatePicker = null;
            this.entityTypeFilter = null;
            this.actionFilter = null;
            
            // Check if DevExtreme is already loaded
            if (typeof DevExpress !== 'undefined') {
                this.initialize();
            } else {
                this.initializeDevExtreme();
            }
        }

        dispose() {
            if (this.grid) {
                this.grid.dispose();
                this.grid = null;
            }
            if (this.startDatePicker) {
                this.startDatePicker.dispose();
                this.startDatePicker = null;
            }
            if (this.endDatePicker) {
                this.endDatePicker.dispose();
                this.endDatePicker = null;
            }
            if (this.entityTypeFilter) {
                this.entityTypeFilter.dispose();
                this.entityTypeFilter = null;
            }
            if (this.actionFilter) {
                this.actionFilter.dispose();
                this.actionFilter = null;
            }
        }

        initializeDevExtreme() {
            console.log('Initializing DevExtreme...');
            // Load DevExtreme if not available
            if (typeof DevExpress === 'undefined') {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://cdn3.devexpress.com/jslib/23.1.3/css/dx.light.css';
                document.head.appendChild(cssLink);

                const script = document.createElement('script');
                script.src = 'https://cdn3.devexpress.com/jslib/23.1.3/js/dx.all.js';
                script.onload = () => {
                    console.log('DevExtreme loaded successfully');
                    this.initialize();
                };
                script.onerror = (error) => {
                    console.error('Failed to load DevExtreme:', error);
                };
                document.head.appendChild(script);
            } else {
                this.initialize();
            }
        }

        initialize() {
            console.log('Initializing Audit Page...');
            this.initializeDatePickers();
            this.initializeFilters();
            this.initializeGrid();
            this.initializeRefreshButton();
            this.updateFilterOptions().then(() => {
                console.log('Filter options updated');
                this.loadData();
            }).catch(error => {
                console.error('Error updating filter options:', error);
            });
            console.log('Audit Page initialized');
        }

        initializeDatePickers() {
            console.log('Initializing date pickers...');
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);

            this.startDatePicker = $('#startDatePicker').dxDateBox({
                type: 'date',
                value: thirtyDaysAgo,
                displayFormat: 'yyyy-MM-dd',
                stylingMode: 'filled',
                onValueChanged: () => this.loadData()
            }).dxDateBox('instance');

            this.endDatePicker = $('#endDatePicker').dxDateBox({
                type: 'date',
                value: today,
                displayFormat: 'yyyy-MM-dd',
                stylingMode: 'filled',
                onValueChanged: () => this.loadData()
            }).dxDateBox('instance');

            console.log('Date pickers initialized');
        }

        initializeFilters() {
            console.log('Initializing filters...');
            // Initialize with default values first
            this.entityTypeFilter = $('#entityTypeFilter').dxSelectBox({
                items: ['All'],
                value: 'All',
                stylingMode: 'filled',
                onValueChanged: () => this.loadData(),
                displayExpr: (item) => item ? item.charAt(0).toUpperCase() + item.slice(1) : '',
                searchEnabled: true
            }).dxSelectBox('instance');

            this.actionFilter = $('#actionFilter').dxSelectBox({
                items: ['All'],
                value: 'All',
                stylingMode: 'filled',
                onValueChanged: () => this.loadData(),
                displayExpr: (item) => item ? item.charAt(0).toUpperCase() + item.slice(1) : '',
                searchEnabled: true
            }).dxSelectBox('instance');

            console.log('Filters initialized');
        }

        async updateFilterOptions() {
            try {
                console.log('Updating filter options...');
                if (!this.entityTypeFilter || !this.actionFilter) {
                    console.warn('Filters not yet initialized');
                    return;
                }

                const today = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(today.getDate() - 30);

                const formattedStartDate = thirtyDaysAgo.toISOString().split('T')[0];
                const formattedEndDate = today.toISOString().split('T')[0];

                // Fetch initial data to get unique values
                const data = await window.vomoAPI.getAuditsByDateRange(formattedStartDate, formattedEndDate);

                // Extract unique entity types and actions
                const entityTypes = ['All', ...new Set(data.map(item => item.entity_type))].sort();
                const actions = ['All', ...new Set(data.map(item => item.action))].sort();

                // Update the filter options
                this.entityTypeFilter.option('items', entityTypes);
                this.actionFilter.option('items', actions);
                
                console.log('Filter options updated successfully');
            } catch (error) {
                console.error('Error updating filter options:', error);
                DevExpress.ui.notify('Failed to load filter options: ' + error.message, 'error', 3000);
            }
        }

        initializeRefreshButton() {
            $('#refreshButton').on('click', () => {
                this.loadData();
            });
        }

        initializeGrid() {
            const gridElement = $('#auditGrid');
            if (!gridElement.length) {
                console.error('Audit grid element not found');
                return;
            }

            if (this.grid) {
                this.grid.dispose();
            }

            this.grid = $('#auditGrid').dxDataGrid({
                dataSource: {
                    store: {
                        type: 'array',
                        key: 'id',
                        data: []
                    }
                },
                remoteOperations: false,
                columnAutoWidth: true,
                showBorders: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columns: [
                    {
                        dataField: 'created_at',
                        caption: 'Date/Time',
                        dataType: 'datetime',
                        format: 'yyyy-MM-dd HH:mm:ss',
                        width: 160,
                        sortOrder: 'desc'
                    },
                    {
                        dataField: 'entity_type',
                        caption: 'Entity Type',
                        width: 120,
                        cellTemplate: (container, options) => {
                            $('<div>')
                                .addClass('d-flex align-items-center')
                                .append(
                                    $('<i>')
                                        .addClass('ni ni-app mr-2')
                                        .css('color', this.getEntityTypeColor(options.value))
                                )
                                .append(
                                    $('<span>').text(this.capitalizeFirstLetter(options.value))
                                )
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'entity_id',
                        caption: 'Entity ID',
                        width: 100,
                        alignment: 'center',
                        cellTemplate: (container, options) => {
                            $('<div>')
                                .addClass('badge badge-primary')
                                .text(options.value)
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'action',
                        caption: 'Action',
                        width: 100,
                        cellTemplate: (container, options) => {
                            const action = options.value.toLowerCase();
                            $('<span>')
                                .addClass(`action-badge ${action}`)
                                .text(action)
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'created_by',
                        caption: 'Created By',
                        width: 120,
                        cellTemplate: (container, options) => {
                            $('<div>')
                                .addClass('d-flex align-items-center')
                                .append(
                                    $('<i>')
                                        .addClass('ni ni-circle-08 mr-2')
                                )
                                .append(
                                    $('<span>').text(options.value)
                                )
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'old_values',
                        caption: 'Old Values',
                        cellTemplate: (container, options) => {
                            if (!options.value) return;
                            this.createJsonViewer(container, options.value);
                        }
                    },
                    {
                        dataField: 'new_values',
                        caption: 'New Values',
                        cellTemplate: (container, options) => {
                            if (!options.value) return;
                            this.createJsonViewer(container, options.value);
                        }
                    }
                ],
                filterRow: { visible: true },
                searchPanel: { visible: true },
                groupPanel: { visible: true },
                columnChooser: { enabled: true },
                headerFilter: { visible: true },
                paging: {
                    pageSize: 20
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 20, 50, 100],
                    showInfo: true
                },
                export: {
                    enabled: true,
                    allowExportSelectedData: true
                },
                stateStoring: {
                    enabled: true,
                    type: 'localStorage',
                    storageKey: 'auditGridState'
                },
                onRowPrepared: (e) => {
                    if (e.rowType === 'data') {
                        e.rowElement.css('cursor', 'pointer');
                    }
                },
                onRowClick: (e) => {
                    if (e.rowType === 'data') {
                        this.showDetailPopup(e.data);
                    }
                },
                onInitialized: () => {
                    console.log('Grid initialized, loading data...');
                    this.loadData();
                }
            }).dxDataGrid('instance');
        }

        getEntityTypeColor(entityType) {
            const colors = {
                menu: '#2c7be5',
                user: '#2dce89',
                role: '#fb6340',
                tenant: '#f5365c',
                default: '#8898aa'
            };
            return colors[entityType] || colors.default;
        }

        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        createJsonViewer(container, data) {
            const $container = $('<div>').addClass('json-container');
            const $viewer = $('<pre>').addClass('json-viewer');
            
            // Format JSON with syntax highlighting
            const formatted = this.formatJson(data);
            $viewer.html(formatted);
            
            $container.append($viewer);
            container.append($container);
        }

        formatJson(obj) {
            return JSON.stringify(obj, null, 2)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
                    let cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                        } else {
                            cls = 'string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return `<span class="${cls}">${match}</span>`;
                });
        }

        showDetailPopup(data) {
            const popupContent = `
                <div class="p-4">
                    <h6 class="mb-3">Audit Detail</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Date/Time:</strong> ${new Date(data.created_at).toLocaleString()}</p>
                            <p><strong>Entity Type:</strong> ${this.capitalizeFirstLetter(data.entity_type)}</p>
                            <p><strong>Entity ID:</strong> ${data.entity_id}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Action:</strong> <span class="action-badge ${data.action.toLowerCase()}">${data.action}</span></p>
                            <p><strong>Created By:</strong> ${data.created_by}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <h6>Old Values</h6>
                            <div class="json-container">
                                <pre class="json-viewer">${this.formatJson(data.old_values)}</pre>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h6>New Values</h6>
                            <div class="json-container">
                                <pre class="json-viewer">${this.formatJson(data.new_values)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const popup = $('<div>').appendTo(document.body);
            popup.dxPopup({
                contentTemplate: popupContent,
                width: 800,
                height: 600,
                showTitle: true,
                title: 'Audit Record Details',
                dragEnabled: true,
                closeOnOutsideClick: true,
                showCloseButton: true,
                position: {
                    my: 'center',
                    at: 'center',
                    of: window
                }
            }).dxPopup('instance');
        }

        async loadData() {
            try {
                console.log('Loading audit data...');
                
                // Check if components are initialized
                if (!this.startDatePicker || !this.endDatePicker || !this.entityTypeFilter || !this.actionFilter) {
                    console.warn('Components not fully initialized, waiting...');
                    return;
                }

                // Get filter values with null checks
                let startDate, endDate, entityType, action;
                
                try {
                    startDate = this.startDatePicker.option('value');
                    endDate = this.endDatePicker.option('value');
                    entityType = this.entityTypeFilter.option('value');
                    action = this.actionFilter.option('value');
                } catch (error) {
                    console.error('Error accessing component values:', error);
                    return;
                }

                if (!startDate || !endDate) {
                    console.warn('Start date or end date is missing');
                    return;
                }

                const formattedStartDate = startDate.toISOString().split('T')[0];
                const formattedEndDate = endDate.toISOString().split('T')[0];

                if (!window.vomoAPI) {
                    console.error('API client not initialized');
                    DevExpress.ui.notify('API client not initialized', 'error', 3000);
                    return;
                }

                console.log('Fetching audit data...', {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    entityType,
                    action
                });

                let data = await window.vomoAPI.getAuditsByDateRange(formattedStartDate, formattedEndDate);
                
                // Apply filters if components are available
                if (entityType && entityType !== 'All') {
                    data = data.filter(item => item.entity_type === entityType);
                }
                if (action && action !== 'All') {
                    data = data.filter(item => item.action.toLowerCase() === action.toLowerCase());
                }

                // Check if grid is still available before updating
                if (this.grid) {
                    console.log('Updating grid with data:', data.length, 'records');
                    this.grid.option('dataSource', data);
                } else {
                    console.warn('Grid not available for data update');
                }
            } catch (error) {
                console.error('Error loading audit data:', error);
                DevExpress.ui.notify('Failed to load audit data: ' + error.message, 'error', 3000);
            }
        }
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking DevExtreme...');
    if (typeof DevExpress !== 'undefined' && !window.auditPageInstance) {
        console.log('Creating AuditPage instance...');
        window.auditPageInstance = new window.AuditPage();
    } else if (typeof DevExpress === 'undefined') {
        console.log('DevExtreme not loaded, will initialize later...');
        const auditPage = new window.AuditPage();
        auditPage.initializeDevExtreme();
    }
}); 