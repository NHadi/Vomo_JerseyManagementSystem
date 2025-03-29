import { vomoAPI } from '../api/index.js';
import { gridUtils } from '../utils/gridUtils.js';

// Define EmployeePage
window.EmployeePage = class {
    constructor() {
        this.grid = null;
        this.selectedDivision = null;
        this.currentEmployee = null;
        this.allDivisions = [];
        this.divisionFilter = '';
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
                                $('<div>')
                                    .addClass('avatar avatar-sm rounded-circle mr-3')
                                    .css('background-color', this.getAvatarColor(options.data.name))
                                    .append(
                                        $('<span>')
                                            .addClass('avatar-initials')
                                            .text(this.getInitials(options.data.name))
                                    )
                            )
                            .append(
                                $('<div>')
                                    .addClass('d-flex flex-column')
                                    .append(
                                        $('<span>').addClass('font-weight-bold').text(options.data.name || '')
                                    )
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
                    confirmDeleteMessage: 'Are you sure you want to delete this employee?',
                    saveRowChanges: 'Save Changes',
                    cancelRowChanges: 'Cancel',
                    deleteRow: 'Delete',
                    editRow: 'Edit',
                    addRow: 'New Employee'
                },
                popup: {
                    title: 'Employee Information',
                    showTitle: true,
                    width: 800,
                    height: 'auto',
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
                            onClick: () => {
                                this.grid.saveEditData();
                            }
                        }
                    }, {
                        toolbar: 'bottom',
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            text: 'Cancel',
                            stylingMode: 'outlined',
                            onClick: () => {
                                this.grid.cancelEditData();
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
                                    label: { text: 'Full Name' },
                                    validationRules: [{ type: 'required', message: 'Full name is required' }],
                                    editorOptions: {
                                        placeholder: 'Enter employee full name',
                                        mode: 'text',
                                        stylingMode: 'filled',
                                        showClearButton: true,
                                        valueChangeEvent: 'keyup change'
                                    }
                                },
                                {
                                    dataField: 'email',
                                    label: { text: 'Email Address' },
                                    validationRules: [
                                        { type: 'required', message: 'Email address is required' },
                                        { type: 'email', message: 'Please enter a valid email address' }
                                    ],
                                    editorOptions: {
                                        placeholder: 'Enter work email address',
                                        mode: 'email',
                                        stylingMode: 'filled',
                                        showClearButton: true,
                                        valueChangeEvent: 'keyup change'
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Contact Details',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'phone',
                                    label: { text: 'Phone Number' },
                                    validationRules: [
                                        { type: 'required', message: 'Phone number is required' },
                                        { 
                                            type: 'pattern',
                                            pattern: /^\+1 \(\d{3}\) \d{3}-\d{4}$/,
                                            message: 'Please enter a valid phone number'
                                        }
                                    ],
                                    editorOptions: {
                                        placeholder: 'Enter phone number',
                                        mask: '+1 (000) 000-0000',
                                        maskRules: {"0": /[0-9]/},
                                        maskInvalidMessage: 'Please enter a valid phone number',
                                        stylingMode: 'filled',
                                        showClearButton: true,
                                        valueChangeEvent: 'keyup change'
                                    }
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
            onContentReady: (e) => {
                // Add export buttons after grid is fully loaded
                if (this.grid && !this.exportButtonsAdded) {
                    gridUtils.addExportButtons(this.grid, 'Employees');
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

        // Initial data load
        this.loadData();
    }

    async loadData() {
        try {
            if (!this.grid) {
                console.warn('Grid instance is not available');
                return;
            }

            // Show loading panel
            this.grid.beginCustomLoading('Loading employees...');

            const data = await vomoAPI.getEmployees();
            
            // Update the data source
            this.grid.option('dataSource', {
                store: {
                    type: 'array',
                    key: 'id',
                    data: data
                }
            });
            
            // Refresh the grid
            this.grid.refresh();

            // Hide loading panel
            this.grid.endCustomLoading();
        } catch (error) {
            gridUtils.handleGridError(error, 'loading employees');
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

    getInitials(name) {
        if (!name) return '';
        return name.split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    getAvatarColor(name) {
        if (!name) return '#5e72e4';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = [
            '#5e72e4', '#11cdef', '#2dce89', '#fb6340', '#f5365c',
            '#8965e0', '#ffd600', '#5603ad', '#8898aa', '#32325d'
        ];
        return colors[Math.abs(hash) % colors.length];
    }

    showNotification(message, type = 'success') {
        DevExpress.ui.notify({
            message,
            type,
            displayTime: 3000,
            position: {
                my: 'center top',
                at: 'center top'
            },
            width: 'auto',
            animation: {
                show: { type: 'fade', duration: 400, from: 0, to: 1 },
                hide: { type: 'fade', duration: 400, to: 0 }
            }
        });
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createEmployee(e.data);
            e.data.id = result.id;
            gridUtils.showSuccess('Employee created successfully');
        } catch (error) {
            gridUtils.handleGridError(error, 'creating employee');
            e.cancel = true;
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateEmployee(e.key.id, {...e.oldData, ...e.newData});
            gridUtils.showSuccess('Employee updated successfully');
        } catch (error) {
            gridUtils.handleGridError(error, 'updating employee');
            e.cancel = true;
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteEmployee(e.key.id);
            gridUtils.showSuccess('Employee deleted successfully');
        } catch (error) {
            gridUtils.handleGridError(error, 'deleting employee');
            e.cancel = true;
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