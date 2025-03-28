import { vomoAPI } from '../api/index.js';

// Define DivisionPage
window.DivisionPage = class {
    constructor() {
        this.grid = null;
        this.selectedEmployees = new Set();
        this.currentDivision = null;
        this.allEmployees = [];
        this.employeeFilter = '';
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();
    }

    dispose() {
        // Clean up event listeners
        $('#employeeModal').off('show.bs.modal');
        $('#employeeModal').off('hide.bs.modal');
        $('#employeeSearchBox').off('input');
        $('#saveEmployees').off('click');

        // Dispose of the grid
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
    }

    bindEvents() {
        // Modal show event
        $('#employeeModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const divisionId = button.data('division-id');
            const divisionName = button.data('division-name');
            this.currentDivision = { id: divisionId, name: divisionName };
            this.loadEmployees(divisionId);
        });

        // Modal hide event
        $('#employeeModal').on('hide.bs.modal', () => {
            this.selectedEmployees.clear();
            this.employeeFilter = '';
            $('#employeeSearchBox').val('');
            $('.employee-list').empty();
        });

        // Employee search
        $('#employeeSearchBox').on('input', (e) => {
            this.employeeFilter = e.target.value.toLowerCase();
            this.renderEmployees();
        });

        // Save employees
        $('#saveEmployees').on('click', () => this.saveEmployees());
    }

    initialize() {
        const gridElement = $('#divisionGrid');
        if (!gridElement.length) {
            console.error('Division grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#divisionGrid').dxDataGrid({
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
                    caption: 'Division Name',
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
                    dataField: 'employees',
                    caption: 'Employees',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: (container, options) => {
                        const $container = $('<div>').addClass('employee-container');
                        
                        if (options.data.employees?.length) {
                            options.data.employees.forEach(employee => {
                                $('<span>')
                                    .addClass('employee-badge')
                                    .append(
                                        $('<i>').addClass('ni ni-single-02')
                                    )
                                    .append(
                                        $('<span>').text(' ' + employee.name)
                                    )
                                    .appendTo($container);
                            });
                        } else {
                            $('<div>')
                                .addClass('text-muted small')
                                .append(
                                    $('<i>').addClass('ni ni-info-circle mr-1')
                                )
                                .append(
                                    $('<span>').text('No employees assigned')
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

                        // Manage Employees Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-primary mr-2')
                            .attr({
                                'title': 'Manage Employees',
                                'data-toggle': 'modal',
                                'data-target': '#employeeModal',
                                'data-division-id': options.row.data.id,
                                'data-division-name': options.row.data.name
                            })
                            .append($('<i>').addClass('ni ni-single-02'))
                            .appendTo($buttonContainer);

                        // Edit Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-info mr-2')
                            .attr('title', 'Edit Division')
                            .append($('<i>').addClass('ni ni-ruler-pencil'))
                            .on('click', () => {
                                this.grid.editRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        // Delete Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-danger')
                            .attr('title', 'Delete Division')
                            .append($('<i>').addClass('ni ni-fat-remove'))
                            .on('click', () => {
                                DevExpress.ui.dialog.confirm("Are you sure you want to delete this division?", "Confirm deletion")
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
                    confirmDeleteMessage: 'Are you sure you want to delete this division?'
                },
                popup: {
                    title: 'Division Information',
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
                                    validationRules: [{ type: 'required', message: 'Division name is required' }]
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
                            text: 'Add Division',
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
            const data = await vomoAPI.getDivisions();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading divisions:', error);
            DevExpress.ui.notify('Failed to load divisions', 'error', 3000);
        }
    }

    async loadEmployees(divisionId) {
        try {
            this.allEmployees = await vomoAPI.getEmployees();
            // Get the current division's employees
            const currentDivision = this.grid.option('dataSource').find(d => d.id === divisionId);
            if (currentDivision?.employees) {
                // Set selected employees based on current division's employees
                this.selectedEmployees = new Set(currentDivision.employees.map(e => e.id));
            }
            this.renderEmployees();
        } catch (error) {
            console.error('Error loading employees:', error);
            DevExpress.ui.notify('Failed to load employees', 'error', 3000);
        }
    }

    renderEmployees() {
        const $employeeList = $('.employee-list');
        $employeeList.empty();

        const filteredEmployees = this.allEmployees.filter(employee => 
            employee.name.toLowerCase().includes(this.employeeFilter) ||
            employee.email?.toLowerCase().includes(this.employeeFilter)
        );

        if (filteredEmployees.length === 0) {
            $employeeList.html(`
                <div class="no-employees">
                    <i class="ni ni-search"></i>
                    No employees found matching your search
                </div>
            `);
            return;
        }

        filteredEmployees.forEach(employee => {
            const isSelected = this.selectedEmployees.has(employee.id);
            const $employeeItem = this.createEmployeeItem(employee, isSelected);
            $employeeList.append($employeeItem);
        });
    }

    createEmployeeItem(employee, isSelected) {
        return $(`
            <div class="employee-item ${isSelected ? 'selected' : ''}" data-employee-id="${employee.id}">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="employee-${employee.id}"
                           ${isSelected ? 'checked' : ''}>
                    <label class="custom-control-label" for="employee-${employee.id}"></label>
                </div>
                <div class="employee-info">
                    <div class="employee-name">${employee.name}</div>
                    <div class="employee-details">${employee.email || 'No email provided'}</div>
                </div>
            </div>
        `).on('change', (e) => {
            const checked = e.target.checked;
            if (checked) {
                this.selectedEmployees.add(employee.id);
            } else {
                this.selectedEmployees.delete(employee.id);
            }
        });
    }

    async saveEmployees() {
        try {
            // Get current division's employees
            const currentDivision = this.grid.option('dataSource').find(d => d.id === this.currentDivision.id);
            const currentEmployeeIds = currentDivision?.employees?.map(e => e.id) || [];
            
            // Calculate which employees to add and remove
            const employeesToAdd = Array.from(this.selectedEmployees).filter(id => !currentEmployeeIds.includes(id));
            const employeesToRemove = currentEmployeeIds.filter(id => !this.selectedEmployees.has(id));
            
            // Add new employees
            if (employeesToAdd.length > 0) {
                await vomoAPI.assignEmployees(this.currentDivision.id, employeesToAdd);
            }
            
            // Remove unselected employees
            if (employeesToRemove.length > 0) {
                await vomoAPI.removeEmployees(this.currentDivision.id, employeesToRemove);
            }
            
            $('#employeeModal').modal('hide');
            this.loadData();
            DevExpress.ui.notify('Employees assigned successfully', 'success', 3000);
        } catch (error) {
            console.error('Error saving employees:', error);
            DevExpress.ui.notify('Failed to assign employees', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createDivision(e.data);
            e.data.id = result.id;
            DevExpress.ui.notify('Division created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating division:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to create division', 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateDivision(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Division updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating division:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update division', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteDivision(e.key.id);
            DevExpress.ui.notify('Division deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting division:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete division', 'error', 3000);
        }
    }

    editDivision(division) {
        const rowIndex = this.grid.getRowIndexByKey(division.id);
        if (rowIndex >= 0) {
            this.grid.editRow(rowIndex);
        }
    }

    deleteDivision(division) {
        const rowIndex = this.grid.getRowIndexByKey(division.id);
        if (rowIndex >= 0) {
            DevExpress.ui.dialog.confirm("Are you sure you want to delete this division?", "Confirm deletion")
                .then((result) => {
                    if (result) {
                        this.grid.deleteRow(rowIndex);
                    }
                });
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.divisionPageInstance) {
    window.divisionPageInstance = new window.DivisionPage();
} 