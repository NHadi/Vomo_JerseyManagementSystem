import { vomoAPI } from '../api/index.js';

window.TaskPage = class {
    constructor() {
        this.tasks = [];
        this.currentTask = null;
        this.employees = new Map(); // Cache for employee data
        this.taskTypes = [
            'LAYOUT',
            'PRINTING',
            'PREPARING',
            'PRESSING',
            'CUTTING',
            'SEWING',
            'FINISHING'
        ];
        
        // Initialize components
        this.initialize();
        
        // Bind event handlers
        this.bindEvents();
        
        // Add styles
        this.addStyles();
    }

    dispose() {
        // Clean up event listeners
        $('#taskDetailsModal').off('show.bs.modal');
        $('#taskDetailsModal').off('hide.bs.modal');
        
        // Remove drag and drop event listeners
        this.removeDragAndDropListeners();
    }

    bindEvents() {
        // Modal events
        $('#taskDetailsModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const taskId = button.data('task-id');
            if (taskId) {
                this.loadTaskDetails(taskId);
            }
        });

        $('#taskDetailsModal').on('hide.bs.modal', () => {
            this.currentTask = null;
        });

        // Task action buttons
        $('#startTask').on('click', () => this.startTask());
        $('#completeTask').on('click', () => this.completeTask());
        $('#addNote').on('click', () => this.addNote());
        $('#reassignTask').on('click', () => this.reassignTask());
        
        // Filter and view options
        $('#filterTasks').on('click', () => this.showFilterModal());
        $('#viewOptions').on('click', () => this.showViewOptions());
    }

    initialize() {
        this.loadData();
        this.initializeDragAndDrop();
    }

    initializeDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
                e.target.classList.add('dragging');
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragging');
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const column = e.target.closest('.tasks-container');
            if (column) {
                column.classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            const column = e.target.closest('.tasks-container');
            if (column) {
                column.classList.remove('drag-over');
            }
        });

        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            const column = e.target.closest('.tasks-container');
            if (column) {
                column.classList.remove('drag-over');
                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = column.dataset.status;
                
                try {
                    await this.updateTaskStatus(taskId, newStatus);
                    await this.loadData(); // Refresh the view
                } catch (error) {
                    console.error('Error updating task status:', error);
                    DevExpress.ui.notify('Failed to update task status', 'error', 3000);
                }
            }
        });
    }

    removeDragAndDropListeners() {
        document.removeEventListener('dragstart', this.handleDragStart);
        document.removeEventListener('dragend', this.handleDragEnd);
        document.removeEventListener('dragover', this.handleDragOver);
        document.removeEventListener('dragleave', this.handleDragLeave);
        document.removeEventListener('drop', this.handleDrop);
    }

    async loadData() {
        try {
            // Load tasks from API
            const tasks = await vomoAPI.getTasks();
            this.tasks = tasks;
            
            // Update statistics and render tasks
            this.updateTaskStatistics(tasks);
            this.renderTasksByDivision(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            DevExpress.ui.notify('Failed to load tasks', 'error', 3000);
        }
    }

    updateTaskStatistics(tasks) {
        const totalTasks = tasks.length;
        const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;
        
        // Update statistics cards
        $('#totalTasks').text(totalTasks);
        $('#inProgressTasks').text(inProgressTasks);
        $('#completedTasks').text(completedTasks);
        $('#pendingTasks').text(pendingTasks);
        
        // Calculate completion rate
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        $('#completionRate').html(`<i class="fa fa-arrow-up"></i> ${completionRate}%`);
        
        // Calculate weekly growth (placeholder)
        $('#tasksGrowth').html('<i class="fa fa-arrow-up"></i> 5%');
    }

    renderTasksByDivision(tasks) {
        // Clear existing content
        $('#main-content').empty();
        
        // Create main container with fixed header and scrollable content
        const container = $('<div>').addClass('division-container').html(`
            <div class="board-header">
                <div class="dashboard-summary">
                    <div class="summary-grid">
                        <div class="summary-card total-tasks">
                            <div class="card-content">
                                <div class="card-header">
                                    <div class="card-title">Total Tasks</div>
                                    <div class="card-icon">
                                        <i class="fas fa-tasks"></i>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="card-value">${tasks.length}</div>
                                    <div class="card-trend positive">
                                        <i class="fas fa-arrow-up"></i>
                                        <span>12% from last week</span>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="progress-mini">
                                        <div class="progress-bar" style="width: ${(tasks.filter(t => t.status === 'completed').length / tasks.length * 100)}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="summary-card pending-tasks">
                            <div class="card-content">
                                <div class="card-header">
                                    <div class="card-title">To Do</div>
                                    <div class="card-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="card-value">${tasks.filter(t => t.status === 'pending').length}</div>
                                    <div class="card-trend">
                                        <div class="task-distribution">
                                            ${this.taskTypes.map(type => {
                                                const count = tasks.filter(t => t.status === 'pending' && t.task_type === type).length;
                                                return count ? `<span class="distribution-item" title="${type}">${count}</span>` : '';
                                            }).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="summary-card in-progress-tasks">
                            <div class="card-content">
                                <div class="card-header">
                                    <div class="card-title">In Progress</div>
                                    <div class="card-icon">
                                        <i class="fas fa-spinner fa-spin"></i>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="card-value">${tasks.filter(t => t.status === 'in_progress').length}</div>
                                    <div class="card-trend">
                                        <div class="task-distribution">
                                            ${this.taskTypes.map(type => {
                                                const count = tasks.filter(t => t.status === 'in_progress' && t.task_type === type).length;
                                                return count ? `<span class="distribution-item" title="${type}">${count}</span>` : '';
                                            }).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="summary-card completed-tasks">
                            <div class="card-content">
                                <div class="card-header">
                                    <div class="card-title">Completed</div>
                                    <div class="card-icon">
                                        <i class="fas fa-check"></i>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="card-value">${tasks.filter(t => t.status === 'completed').length}</div>
                                    <div class="card-trend positive">
                                        <i class="fas fa-arrow-up"></i>
                                        <span>8% from last week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-actions">
                        <button class="btn btn-light btn-sm" id="viewFilters">
                            <i class="fas fa-filter"></i> Filters
                        </button>
                        <button class="btn btn-light btn-sm" id="viewSettings">
                            <i class="fas fa-cog"></i> Settings
                        </button>
                    </div>
                </div>
            </div>
            <div class="board-content">
                <div class="divisions-wrapper"></div>
            </div>
        `);

        // Add styles specific to the dashboard
        this.addDashboardStyles();
        
        // Rest of the existing code...
        const tasksByType = this.groupTasksByType(tasks);
        const divisionsWrapper = container.find('.divisions-wrapper');
        
        this.taskTypes.forEach(type => {
            const divisionTasks = tasksByType[type] || [];
            const divisionSection = this.createDivisionSection(type, divisionTasks);
            divisionsWrapper.append(divisionSection);
        });
        
        $('#main-content').append(container);
    }

    addDashboardStyles() {
        const styles = `
            .dashboard-summary {
                padding: 1rem;
                background: #fff;
            }

            .summary-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .summary-card {
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.05);
            }

            .summary-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            }

            .card-content {
                padding: 1.25rem;
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .card-title {
                font-size: 0.875rem;
                font-weight: 600;
                color: #8898aa;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .card-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            .total-tasks .card-icon {
                background: rgba(94, 114, 228, 0.1);
                color: #5e72e4;
            }

            .pending-tasks .card-icon {
                background: rgba(251, 99, 64, 0.1);
                color: #fb6340;
            }

            .in-progress-tasks .card-icon {
                background: rgba(45, 206, 137, 0.1);
                color: #2dce89;
            }

            .completed-tasks .card-icon {
                background: rgba(45, 206, 137, 0.1);
                color: #2dce89;
            }

            .card-body {
                margin-bottom: 1rem;
            }

            .card-value {
                font-size: 2rem;
                font-weight: 600;
                color: #32325d;
                line-height: 1.2;
                margin-bottom: 0.5rem;
            }

            .card-trend {
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #8898aa;
            }

            .card-trend.positive {
                color: #2dce89;
            }

            .card-trend.negative {
                color: #fb6340;
            }

            .progress-mini {
                height: 4px;
                background: rgba(94, 114, 228, 0.1);
                border-radius: 2px;
                overflow: hidden;
            }

            .progress-bar {
                height: 100%;
                background: #5e72e4;
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            .task-distribution {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .distribution-item {
                padding: 0.25rem 0.5rem;
                background: #f6f9fc;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600;
                color: #8898aa;
            }

            .dashboard-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }

            @media (max-width: 1200px) {
                .summary-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (max-width: 768px) {
                .summary-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        // Add styles to head if not already added
        if (!document.querySelector('style[data-dashboard-styles]')) {
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-dashboard-styles', '');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
    }

    showTaskSummaryDetails(type) {
        let filteredTasks = this.tasks;
        let title = 'All Tasks';

        if (type !== 'all') {
            filteredTasks = this.tasks.filter(t => t.status === type);
            title = `${type.replace('_', ' ').toUpperCase()} Tasks`;
        }

        // Show task details in a modal or side panel
        DevExpress.ui.dialog.custom({
            title: title,
            content: this.createTaskSummaryContent(filteredTasks),
            buttons: [{
                text: 'Close',
                onClick: () => true
            }],
            width: '800px',
            height: '600px'
        });
    }

    createTaskSummaryContent(tasks) {
        const container = $('<div>').addClass('task-summary-container');
        
        // Add summary statistics
        const stats = $('<div>').addClass('summary-stats').html(`
            <div class="stat-item">
                <div class="stat-value">${tasks.length}</div>
                <div class="stat-label">Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${tasks.filter(t => t.employee_id).length}</div>
                <div class="stat-label">Assigned</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${tasks.filter(t => t.completed_at).length}</div>
                <div class="stat-label">Completed</div>
            </div>
        `);
        
        // Add task list
        const taskList = $('<div>').addClass('task-list');
        tasks.forEach(task => {
            taskList.append(this.createTaskSummaryItem(task));
        });
        
        return container.append(stats, taskList);
    }

    createTaskSummaryItem(task) {
        const timeInfo = this.formatTaskTime(task);
        return $('<div>').addClass('task-summary-item').html(`
            <div class="task-summary-header">
                <span class="badge badge-${this.getStatusClass(task.status)}">
                    ${task.status.replace('_', ' ').toUpperCase()}
                </span>
                <span class="task-type">${task.task_type}</span>
            </div>
            <div class="task-summary-body">
                <div class="task-description">${task.notes || 'No description'}</div>
                <div class="task-meta">
                    <span class="employee">
                        <i class="fas fa-user"></i> E${task.employee_id}
                    </span>
                    <span class="order">
                        <i class="fas fa-shopping-cart"></i> Order #${task.order_item_id}
                    </span>
                    <span class="time">
                        <i class="${timeInfo.icon}"></i> ${timeInfo.text}
                    </span>
                </div>
            </div>
        `);
    }

    groupTasksByType(tasks) {
        return tasks.reduce((groups, task) => {
            const type = task.task_type.toUpperCase();
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(task);
            return groups;
        }, {});
    }

    createDivisionSection(type, tasks) {
        const section = $('<div>').addClass('division-section');
        
        // Division header with task counts
        const header = $('<div>').addClass('division-header');
        const taskCounts = this.getTaskCountsByStatus(tasks);
        
        header.html(`
            <div class="division-header-content">
                <div class="division-title">
                    <i class="fas fa-layer-group"></i>
                    <h5>${type}</h5>
                </div>
                <div class="task-counts">
                    <span class="task-count total" title="Total Tasks">
                        <i class="fas fa-tasks"></i>${tasks.length}
                    </span>
                    <span class="task-count pending" title="Pending Tasks">
                        <i class="fas fa-clock"></i>${taskCounts.pending}
                    </span>
                    <span class="task-count in-progress" title="In Progress">
                        <i class="fas fa-spinner"></i>${taskCounts.inProgress}
                    </span>
                    <span class="task-count completed" title="Completed">
                        <i class="fas fa-check"></i>${taskCounts.completed}
                    </span>
                </div>
            </div>
        `);
        
        // Task columns container
        const columnsContainer = $('<div>').addClass('task-columns');
        
        // Create status columns
        const statuses = [
            { key: 'pending', label: 'To Do', icon: 'clock' },
            { key: 'in_progress', label: 'In Progress', icon: 'spinner fa-spin' },
            { key: 'completed', label: 'Completed', icon: 'check' }
        ];
        
        statuses.forEach(status => {
            const statusTasks = tasks.filter(task => task.status === status.key);
            const column = this.createStatusColumn(status, statusTasks);
            columnsContainer.append(column);
        });
        
        section.append(header, columnsContainer);
        return section;
    }

    createStatusColumn(status, tasks) {
        const column = $('<div>').addClass('status-column');
        
        // Column header
        const header = $('<div>').addClass('column-header')
            .html(`
                <div class="column-title">
                    <i class="fas fa-${status.icon}"></i>
                    <span>${status.label}</span>
                    <span class="task-count">${tasks.length}</span>
                </div>
            `);
            
        const tasksContainer = $('<div>')
            .addClass('tasks-container')
            .attr('data-status', status.key);
        
        if (tasks.length === 0) {
            tasksContainer.append(`
                <div class="empty-column">
                    <div>
                        <i class="fas fa-inbox mb-2"></i>
                        <div>No tasks</div>
                    </div>
                </div>
            `);
        } else {
            // Add tasks
            tasks.forEach(task => {
                const taskCard = this.createTaskCard(task);
                tasksContainer.append(taskCard);
            });
        }
        
        column.append(header, tasksContainer);
        return column;
    }

    createTaskCard(task) {
        const card = $('<div>')
            .addClass('task-card')
            .attr({
                'draggable': 'true',
                'data-task-id': task.id
            });
        
        const statusClass = this.getStatusClass(task.status);
        const timeInfo = this.formatTaskTime(task);
        
        card.html(`
            <div class="task-card-content">
                <div class="task-header">
                    <div class="task-badges">
                        <span class="badge badge-${statusClass}">
                            ${task.status === 'in_progress' ? 
                                '<i class="fas fa-spinner fa-spin"></i>' : 
                                '<i class="fas fa-circle"></i>'}
                            ${task.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span class="employee-badge" title="Assigned Employee">
                            <i class="fas fa-user"></i>
                            E${task.employee_id}
                        </span>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-icon" title="More Actions">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                </div>
                
                <div class="task-body">
                    <div class="task-description">
                        ${task.notes || 'No description provided'}
                    </div>
                    <div class="task-meta">
                        <span class="order-ref" title="Order Reference">
                            <i class="fas fa-shopping-cart"></i>
                            Order #${task.order_item_id}
                        </span>
                    </div>
                </div>
                
                <div class="task-footer">
                    <div class="task-time" title="${timeInfo.tooltip}">
                        <i class="${timeInfo.icon}"></i>
                        ${timeInfo.text}
                    </div>
                </div>
            </div>
        `);
        
        return card;
    }

    formatTaskTime(task) {
        const formatDateTime = (date) => {
            const d = new Date(date);
            return d.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        };

        if (task.completed_at) {
            return {
                icon: 'fas fa-check-circle text-success',
                text: formatDateTime(task.completed_at),
                tooltip: `Completed on ${new Date(task.completed_at).toLocaleString()}`
            };
        }
        if (task.started_at) {
            return {
                icon: 'fas fa-play-circle text-primary',
                text: formatDateTime(task.started_at),
                tooltip: `Started on ${new Date(task.started_at).toLocaleString()}`
            };
        }
        return {
            icon: 'fas fa-clock text-muted',
            text: formatDateTime(task.created_at),
            tooltip: `Created on ${new Date(task.created_at).toLocaleString()}`
        };
    }

    getStatusClass(status) {
        const classes = {
            'pending': 'warning',
            'in_progress': 'primary',
            'completed': 'success'
        };
        return classes[status] || 'secondary';
    }

    getTaskCountsByStatus(tasks) {
        return {
            pending: tasks.filter(t => t.status === 'pending').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            completed: tasks.filter(t => t.status === 'completed').length
        };
    }

    async updateTaskStatus(taskId, newStatus) {
        try {
            await vomoAPI.updateTaskStatus(taskId, newStatus);
            await this.loadData(); // Refresh the view
            DevExpress.ui.notify('Task status updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating task status:', error);
            DevExpress.ui.notify('Failed to update task status', 'error', 3000);
        }
    }

    // Add styles to the page
    addStyles() {
        const styles = `
            .division-container {
                height: calc(100vh - 80px);
                display: flex;
                flex-direction: column;
                background: #f8f9fa;
                overflow: hidden;
            }
            
            .board-header {
                background: #fff;
                border-bottom: 1px solid #e9ecef;
                padding: 1rem;
                position: sticky;
                top: 0;
                z-index: 100;
            }

            .board-content {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }

            .divisions-wrapper {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                padding-bottom: 2rem;
            }

            .division-section {
                background: transparent;
            }
            
            .division-header {
                margin-bottom: 1rem;
                position: sticky;
                top: 0;
                z-index: 5;
            }
            
            .division-header-content {
                background: white;
                border-radius: 8px;
                padding: 1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .task-columns {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                min-height: 100px;
            }
            
            .status-column {
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                display: flex;
                flex-direction: column;
                height: fit-content;
                min-height: 100px;
            }

            .tasks-container {
                padding: 1rem;
                min-height: 50px;
                max-height: 500px;
                overflow-y: auto;
                flex: 1;
            }

            .tasks-container::-webkit-scrollbar {
                width: 6px;
            }

            .tasks-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .tasks-container::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }

            .tasks-container::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            .empty-column {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100px;
                color: #8898aa;
                font-size: 0.875rem;
                text-align: center;
                border: 2px dashed #e9ecef;
                border-radius: 6px;
                margin: 0.5rem;
            }

            .division-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .division-title i {
                font-size: 1.25rem;
                color: #5e72e4;
            }
            
            .division-title h5 {
                margin: 0;
                font-weight: 600;
                color: #32325d;
            }
            
            .task-counts {
                display: flex;
                gap: 1rem;
            }
            
            .task-count {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .task-count i {
                font-size: 0.875rem;
            }
            
            .task-count.total {
                background: rgba(94, 114, 228, 0.1);
                color: #5e72e4;
            }
            
            .task-count.pending {
                background: rgba(251, 99, 64, 0.1);
                color: #fb6340;
            }
            
            .task-count.in-progress {
                background: rgba(45, 206, 137, 0.1);
                color: #2dce89;
            }
            
            .task-count.completed {
                background: rgba(94, 114, 228, 0.1);
                color: #5e72e4;
            }
            
            .task-columns {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-top: 1rem;
                min-height: 300px;
            }
            
            .column-header {
                padding: 1rem;
                border-bottom: 1px solid #e9ecef;
                background: white;
                border-radius: 8px 8px 0 0;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            
            .column-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #8898aa;
                font-weight: 600;
                font-size: 0.875rem;
            }
            
            .column-title .task-count {
                margin-left: auto;
                background: #f6f9fc;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
            }
            
            .task-card {
                background: white;
                border-radius: 8px;
                margin-bottom: 0.75rem;
                border: 1px solid #e9ecef;
                transition: all 0.2s ease;
                cursor: grab;
            }
            
            .task-card:hover {
                box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1);
                transform: translateY(-1px);
            }
            
            .task-card.dragging {
                opacity: 0.9;
                transform: rotate(2deg);
                box-shadow: 0 8px 16px rgba(50, 50, 93, 0.15);
            }
            
            .task-card-content {
                padding: 1rem;
            }
            
            .task-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.75rem;
            }
            
            .task-badges {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .badge {
                padding: 0.5rem 0.75rem;
                font-size: 0.75rem;
                font-weight: 600;
                border-radius: 4px;
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
            }
            
            .badge i {
                font-size: 0.625rem;
            }
            
            .badge-warning {
                background: rgba(251, 99, 64, 0.1);
                color: #fb6340;
            }
            
            .badge-primary {
                background: rgba(94, 114, 228, 0.1);
                color: #5e72e4;
            }
            
            .badge-success {
                background: rgba(45, 206, 137, 0.1);
                color: #2dce89;
            }
            
            .employee-badge {
                background: #f6f9fc;
                color: #8898aa;
                padding: 0.5rem 0.75rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
            }
            
            .btn-icon {
                padding: 0.25rem;
                background: transparent;
                border: none;
                color: #8898aa;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .btn-icon:hover {
                background: #f6f9fc;
                color: #5e72e4;
            }
            
            .task-body {
                margin-bottom: 0.75rem;
            }
            
            .task-description {
                color: #525f7f;
                font-size: 0.875rem;
                line-height: 1.5;
                margin-bottom: 0.75rem;
            }
            
            .task-meta {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
            }
            
            .order-ref {
                color: #8898aa;
                font-size: 0.75rem;
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
            }
            
            .task-footer {
                padding-top: 0.75rem;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .task-time {
                color: #8898aa;
                font-size: 0.75rem;
                display: flex;
                align-items: center;
                gap: 0.375rem;
            }
            
            @media (max-width: 1200px) {
                .task-columns {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            
            @media (max-width: 768px) {
                .task-columns {
                    grid-template-columns: 1fr;
                }
                
                .division-header-content {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: flex-start;
                }
                
                .task-counts {
                    width: 100%;
                    justify-content: space-between;
                }
            }
        `;
        
        // Add styles to head
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.taskPageInstance) {
    window.taskPageInstance = new window.TaskPage();
}