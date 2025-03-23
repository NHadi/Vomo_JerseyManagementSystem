// Define AuditPage only if it hasn't been defined yet
if (typeof window.AuditPage === 'undefined') {
    window.AuditPage = class {
        constructor() {
            this.grid = null;
            this.startDatePicker = null;
            this.endDatePicker = null;
            this.apiBaseUrl = 'http://localhost:8090/api'; // Update to correct port
            
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
            // Initialize date pickers
            this.initializeDatePickers();

            // Initialize grid
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
                columns: [
                    {
                        dataField: 'created_at',
                        caption: 'Date/Time',
                        dataType: 'datetime',
                        format: 'yyyy-MM-dd HH:mm:ss'
                    },
                    {
                        dataField: 'entity_type',
                        caption: 'Entity Type'
                    },
                    {
                        dataField: 'entity_id',
                        caption: 'Entity ID'
                    },
                    {
                        dataField: 'action',
                        caption: 'Action'
                    },
                    {
                        dataField: 'created_by',
                        caption: 'Created By'
                    },
                    {
                        dataField: 'old_values',
                        caption: 'Old Values',
                        cellTemplate: (container, options) => {
                            const content = options.value ? JSON.stringify(options.value, null, 2) : '';
                            $('<div>')
                                .text(content)
                                .css('white-space', 'pre-wrap')
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'new_values',
                        caption: 'New Values',
                        cellTemplate: (container, options) => {
                            const content = options.value ? JSON.stringify(options.value, null, 2) : '';
                            $('<div>')
                                .text(content)
                                .css('white-space', 'pre-wrap')
                                .appendTo(container);
                        }
                    }
                ],
                showBorders: true,
                filterRow: { visible: true },
                searchPanel: { visible: true },
                groupPanel: { visible: true },
                columnChooser: { enabled: true },
                headerFilter: { visible: true },
                export: {
                    enabled: true,
                    allowExportSelectedData: true
                },
                onInitialized: () => {
                    console.log('Grid initialized, loading data...');
                    this.loadData();
                }
            }).dxDataGrid('instance');

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
                label: 'Start Date',
                onValueChanged: () => this.loadData()
            }).dxDateBox('instance');

            this.endDatePicker = $('#endDatePicker').dxDateBox({
                type: 'date',
                value: today,
                label: 'End Date',
                onValueChanged: () => this.loadData()
            }).dxDateBox('instance');

            console.log('Date pickers initialized');
        }

        async loadData() {
            try {
                console.log('Loading audit data...');
                const startDate = this.startDatePicker.option('value');
                const endDate = this.endDatePicker.option('value');

                if (!startDate || !endDate) {
                    console.warn('Start date or end date is missing');
                    return;
                }

                const formattedStartDate = startDate.toISOString().split('T')[0];
                const formattedEndDate = endDate.toISOString().split('T')[0];

                const token = localStorage.getItem('token');
                const tenantId = localStorage.getItem('tenant_id');

                if (!token || !tenantId) {
                    console.error('Missing authentication token or tenant ID');
                    DevExpress.ui.notify('Authentication required', 'error', 3000);
                    return;
                }

                console.log('Fetching data from:', `${this.apiBaseUrl}/audits/date-range`);
                const response = await fetch(`${this.apiBaseUrl}/audits/date-range?start_date=${formattedStartDate}&end_date=${formattedEndDate}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Tenant-ID': tenantId
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Data received:', data);
                this.grid.option('dataSource', data);
            } catch (error) {
                console.error('Error loading audit data:', error);
                DevExpress.ui.notify('Failed to load audit data: ' + error.message, 'error', 3000);
            }
        }
    }
}

// Initialize only if DevExtreme is loaded
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