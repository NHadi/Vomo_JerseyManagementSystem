import { vomoAPI } from '../api/index.js';

// Define EmployeePage
window.EmployeePage = class {
    constructor() {
        this.grid = null;
        this.selectedDivision = null;
        this.currentEmployee = null;
        this.allDivisions = [];
        this.divisionFilter = '';
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();
    }

    dispose() {
        // Clean up event listeners
        $('#divisionModal').off('show.bs.modal');
        $('#divisionModal').off('hide.bs.modal');
        $('#divisionSearchBox').off('input');
        $('#saveDivision').off('click');

        // Dispose of the grid
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
    }

    bindEvents() {
        // Modal show event
        $('#divisionModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const employeeId = button.data('employee-id');
            const employeeName = button.data('employee-name');
            this.currentEmployee = { id: employeeId, name: employeeName };
            this.loadDivisions(employeeId);
        });

        // Modal hide event
        $('#divisionModal').on('hide.bs.modal', () => {
            this.selectedDivision = null;
            this.divisionFilter = '';
            $('#divisionSearchBox').val('');
            $('.division-list').empty();
        });

        // Division search
        $('#divisionSearchBox').on('input', (e) => {
            this.divisionFilter = e.target.value.toLowerCase();
            this.renderDivisions();
        });

        // Save division
        $('#saveDivision').on('click', () => this.saveDivision());
    }

    initialize() {
        const gridElement = $('#employeeGrid');
        if (!gridElement.length) {
            console.error('Employee grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#employeeGrid').dxDataGrid({
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
                    caption: 'Employee Name',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>').addClass('ni ni-single-02 mr-2 text-primary')
                            )
                            .append(
                                $('<span>').text(options.data.name || '')
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'email',
                    caption: 'Email',
                    validationRules: [
                        { type: 'required' },
                        { type: 'email' }
                    ],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>').addClass('ni ni-email-83 mr-2 text-info')
                            )
                            .append(
                                $('<span>').text(options.data.email || '')
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'phone',
                    caption: 'Phone',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>').addClass('ni ni-mobile-button mr-2 text-warning')
                            )
                            .append(
                                $('<span>').text(options.data.phone || '')
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'division',
                    caption: 'Division',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: (container, options) => {
                        const $container = $('<div>').addClass('division-container');
                        
                        if (options.data.division) {
                            $('<span>')
                                .addClass('division-badge')
                                .append(
                                    $('<i>').addClass('ni ni-building')
                                )
                                .append(
                                    $('<span>').text(' ' + options.data.division.name)
                                )
                                .appendTo($container);
                        } else {
                            $('<div>')
                                .addClass('text-muted small')
                                .append(
                                    $('<i>').addClass('ni ni-info-circle mr-1')
                                )
                                .append(
                                    $('<span>').text('No division assigned')
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

                        // Assign Division Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-primary mr-2')
                            .attr({
                                'title': 'Assign Division',
                                'data-toggle': 'modal',
                                'data-target': '#divisionModal',
                                'data-employee-id': options.row.data.id,
                                'data-employee-name': options.row.data.name
                            })
                            .append($('<i>').addClass('ni ni-building'))
                            .appendTo($buttonContainer);

                        // Edit Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-info mr-2')
                            .attr('title', 'Edit Employee')
                            .append($('<i>').addClass('ni ni-ruler-pencil'))
                            .on('click', () => {
                                this.grid.editRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        // Delete Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-danger')
                            .attr('title', 'Delete Employee')
                            .append($('<i>').addClass('ni ni-fat-remove'))
                            .on('click', () => {
                                DevExpress.ui.dialog.confirm("Are you sure you want to delete this employee?", "Confirm deletion")
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
                    confirmDeleteMessage: 'Are you sure you want to delete this employee?'
                },
                popup: {
                    title: 'Employee Information',
                    showTitle: true,
                    width: 700,
                    height: 425
                },
                form: {
                    items: [
                        {
                            itemType: 'group',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'name',
                                    validationRules: [{ type: 'required', message: 'Employee name is required' }]
                                },
                                {
                                    dataField: 'email',
                                    validationRules: [
                                        { type: 'required', message: 'Email is required' },
                                        { type: 'email', message: 'Invalid email format' }
                                    ]
                                },
                                {
                                    dataField: 'phone',
                                    validationRules: [{ type: 'required', message: 'Phone number is required' }]
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
                            text: 'Add Employee',
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
            const data = await vomoAPI.getEmployees();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading employees:', error);
            DevExpress.ui.notify('Failed to load employees', 'error', 3000);
        }
    }

    async loadDivisions(employeeId) {
        try {
            this.allDivisions = await vomoAPI.getDivisions();
            // Get the current employee's division
            const currentEmployee = this.grid.option('dataSource').find(e => e.id === employeeId);
            if (currentEmployee?.division) {
                // Set selected division based on current employee's division
                this.selectedDivision = currentEmployee.division;
            }
            this.renderDivisions();
        } catch (error) {
            console.error('Error loading divisions:', error);
            DevExpress.ui.notify('Failed to load divisions', 'error', 3000);
        }
    }

    renderDivisions() {
        const $divisionList = $('.division-list');
        $divisionList.empty();

        const filteredDivisions = this.allDivisions.filter(division => 
            division.name.toLowerCase().includes(this.divisionFilter) ||
            division.description?.toLowerCase().includes(this.divisionFilter)
        );

        if (filteredDivisions.length === 0) {
            $divisionList.html(`
                <div class="no-divisions">
                    <i class="ni ni-search"></i>
                    No divisions found matching your search
                </div>
            `);
            return;
        }

        filteredDivisions.forEach(division => {
            const isSelected = this.selectedDivision?.id === division.id;
            const $divisionItem = this.createDivisionItem(division, isSelected);
            $divisionList.append($divisionItem);
        });
    }

    createDivisionItem(division, isSelected) {
        return $(`
            <div class="division-item ${isSelected ? 'selected' : ''}" data-division-id="${division.id}">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="division-${division.id}"
                           name="division" ${isSelected ? 'checked' : ''}>
                    <label class="custom-control-label" for="division-${division.id}"></label>
                </div>
                <div class="division-info">
                    <div class="division-name">${division.name}</div>
                    <div class="division-details">${division.description || 'No description provided'}</div>
                </div>
            </div>
        `).on('change', () => {
            this.selectedDivision = division;
        });
    }

    async saveDivision() {
        if (!this.currentEmployee || !this.selectedDivision) {
            DevExpress.ui.notify('Please select a division', 'warning', 3000);
            return;
        }

        try {
            // Get current employee's division
            const currentEmployee = this.grid.option('dataSource').find(e => e.id === this.currentEmployee.id);
            
            // If employee already has a division and it's different from the selected one
            if (currentEmployee?.division?.id && currentEmployee.division.id !== this.selectedDivision.id) {
                // Remove from old division
                await vomoAPI.removeDivision(this.currentEmployee.id);
            }
            
            // Assign to new division
            await vomoAPI.assignDivision(this.currentEmployee.id, this.selectedDivision.id);
            
            $('#divisionModal').modal('hide');
            this.loadData();
            DevExpress.ui.notify('Division assigned successfully', 'success', 3000);
        } catch (error) {
            console.error('Error saving division:', error);
            DevExpress.ui.notify('Failed to assign division', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createEmployee(e.data);
            e.data.id = result.id;
            DevExpress.ui.notify('Employee created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating employee:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to create employee', 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateEmployee(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Employee updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating employee:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update employee', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteEmployee(e.key.id);
            DevExpress.ui.notify('Employee deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting employee:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete employee', 'error', 3000);
        }
    }

    editEmployee(employee) {
        const rowIndex = this.grid.getRowIndexByKey(employee.id);
        if (rowIndex >= 0) {
            this.grid.editRow(rowIndex);
        }
    }

    deleteEmployee(employee) {
        const rowIndex = this.grid.getRowIndexByKey(employee.id);
        if (rowIndex >= 0) {
            DevExpress.ui.dialog.confirm("Are you sure you want to delete this employee?", "Confirm deletion")
                .then((result) => {
                    if (result) {
                        this.grid.deleteRow(rowIndex);
                    }
                });
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.employeePageInstance) {
    window.employeePageInstance = new window.EmployeePage();
} 