import { vomoAPI } from '../api/index.js';
import { gridUtils } from '../utils/gridUtils.js';

window.OrderPage = class {
    constructor() {
        this.grid = null;
        this.orderItemsGrid = null;
        this.currentOrder = null;
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();
    }

    dispose() {
        // Clean up event listeners
        $('#orderDetailsModal').off('show.bs.modal');
        $('#orderDetailsModal').off('hide.bs.modal');
        
        // Dispose of grids
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
        if (this.orderItemsGrid) {
            this.orderItemsGrid.dispose();
            this.orderItemsGrid = null;
        }
    }

    bindEvents() {
        // Modal show event
        $('#orderDetailsModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const orderId = button.data('order-id');
            if (orderId) {
                this.loadOrderDetails(orderId);
            }
        });

        // Modal hide event
        $('#orderDetailsModal').on('hide.bs.modal', () => {
            this.currentOrder = null;
            this.clearOrderDetails();
        });

        // Action buttons
        $('#editOrder').on('click', () => this.editOrder());
        $('#updateStatus').on('click', () => this.updateOrderStatus());
        $('#printOrder').on('click', () => this.printOrder());
        $('#cancelOrder').on('click', () => this.cancelOrder());
    }

    initialize() {
        this.initializeGrid();
        this.loadData();
        this.updateStats();
    }

    initializeGrid() {
        const gridElement = $('#orderGrid');
        if (!gridElement.length) {
            console.error('Order grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        // Store reference to this for use in callbacks
        const self = this;

        this.grid = $('#orderGrid').dxDataGrid({
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
                    dataField: 'order_number',
                    caption: 'Order Info',
                    cellTemplate: (container, options) => {
                        const order = options.data;
                        $('<div>')
                            .addClass('d-flex flex-column')
                            .append(
                                $('<div>')
                                    .addClass('font-weight-bold')
                                    .text(order.order_number)
                            )
                            .append(
                                $('<small>')
                                    .addClass('text-muted')
                                    .text(new Date(order.created_at).toLocaleDateString())
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'customer_name',
                    caption: 'Customer',
                    cellTemplate: (container, options) => {
                        const order = options.data;
                        $('<div>')
                            .addClass('d-flex flex-column')
                            .append(
                                $('<div>')
                                    .addClass('font-weight-bold')
                                    .text(order.customer_name)
                            )
                            .append(
                                $('<small>')
                                    .addClass('text-muted')
                                    .append($('<i>').addClass('fas fa-envelope mr-1'))
                                    .append(order.customer_email)
                            )
                            .append(
                                $('<small>')
                                    .addClass('text-muted')
                                    .append($('<i>').addClass('fas fa-phone mr-1'))
                                    .append(order.customer_phone)
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'order_items',
                    caption: 'Items',
                    allowFiltering: false,
                    cellTemplate: (container, options) => {
                        const items = options.data.order_items || [];
                        const $container = $('<div>').addClass('d-flex flex-column');
                        
                        items.forEach(item => {
                            $('<div>')
                                .addClass('mb-2')
                                .append(
                                    $('<div>')
                                        .addClass('d-flex align-items-center')
                                        .append(
                                            $('<span>')
                                                .addClass('badge badge-soft-primary mr-2')
                                                .text(`${item.quantity}x`)
                                        )
                                        .append(
                                            $('<div>')
                                                .addClass('d-flex flex-column')
                                                .append(
                                                    $('<div>')
                                                        .addClass('font-weight-bold')
                                                        .text(`${item.size} - ${item.color}`)
                                                )
                                                .append(
                                                    $('<small>')
                                                        .addClass('text-muted')
                                                        .text(item.customization?.name ? 
                                                            `${item.customization.name} #${item.customization.number}` : 
                                                            'No customization')
                                                )
                                        )
                                )
                                .appendTo($container);
                        });
                        
                        container.append($container);
                    }
                },
                {
                    dataField: 'status',
                    caption: 'Status',
                    cellTemplate: (container, options) => {
                        const status = options.value;
                        const statusClass = this.getStatusClass(status);
                        const statusIcon = this.getStatusIcon(status);
                        
                        $('<div>')
                            .addClass(`order-status ${statusClass}`)
                            .append($('<i>').addClass(`fas ${statusIcon}`))
                            .append(status.replace(/_/g, ' ').toUpperCase())
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'payment_status',
                    caption: 'Payment',
                    cellTemplate: (container, options) => {
                        const status = options.value;
                        const paymentClass = this.getPaymentClass(status);
                        const paymentIcon = this.getPaymentIcon(status);
                        
                        $('<div>')
                            .addClass('d-flex flex-column')
                            .append(
                                $('<div>')
                                    .addClass(`payment-badge ${paymentClass}`)
                                    .append($('<i>').addClass(`fas ${paymentIcon} mr-1`))
                                    .append(status.replace(/_/g, ' ').toUpperCase())
                            )
                            .append(
                                $('<div>')
                                    .addClass('mt-1 font-weight-bold')
                                    .text(`$${options.data.total_amount.toFixed(2)}`)
                            )
                            .appendTo(container);
                    }
                },
                {
                    type: 'buttons',
                    width: 110,
                    buttons: [{
                        hint: 'View Details',
                        icon: 'fas fa-eye',
                        onClick: (e) => {
                            this.showOrderDetails(e.row.data);
                        }
                    }, {
                        hint: 'Print Order',
                        icon: 'fas fa-print',
                        onClick: (e) => {
                            this.printOrder(e.row.data);
                        }
                    }]
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
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    // Create a container for the details
                    const $detailContent = $('<div>').addClass('order-detail-container p-4');
                    
                    // Customer Information Section
                    const $customerInfo = $('<div>')
                        .addClass('mb-4')
                        .append(
                            $('<h6>')
                                .addClass('heading-small text-muted mb-3')
                                .text('Customer Information')
                        )
                        .append(
                            $('<div>')
                                .addClass('row')
                                .append(
                                    $('<div>')
                                        .addClass('col-md-4')
                                        .append(
                                            $('<div>')
                                                .addClass('d-flex flex-column')
                                                .append(
                                                    $('<small>').addClass('text-muted').text('Name')
                                                )
                                                .append(
                                                    $('<span>')
                                                        .addClass('font-weight-bold')
                                                        .text(options.data.customer_name)
                                                )
                                        )
                                )
                                .append(
                                    $('<div>')
                                        .addClass('col-md-4')
                                        .append(
                                            $('<div>')
                                                .addClass('d-flex flex-column')
                                                .append(
                                                    $('<small>').addClass('text-muted').text('Email')
                                                )
                                                .append(
                                                    $('<span>')
                                                        .addClass('font-weight-bold')
                                                        .text(options.data.customer_email)
                                                )
                                        )
                                )
                                .append(
                                    $('<div>')
                                        .addClass('col-md-4')
                                        .append(
                                            $('<div>')
                                                .addClass('d-flex flex-column')
                                                .append(
                                                    $('<small>').addClass('text-muted').text('Phone')
                                                )
                                                .append(
                                                    $('<span>')
                                                        .addClass('font-weight-bold')
                                                        .text(options.data.customer_phone)
                                                )
                                        )
                                )
                        );

                    // Order Items Section
                    const $itemsSection = $('<div>')
                        .addClass('mt-4')
                        .append(
                            $('<h6>')
                                .addClass('heading-small text-muted mb-3')
                                .text('Order Items')
                        );

                    // Create items grid
                    const $itemsGrid = $('<div>').addClass('order-items-grid');
                    $itemsSection.append($itemsGrid);

                    // Initialize items grid
                    $itemsGrid.dxDataGrid({
                        dataSource: options.data.order_items,
                        showBorders: true,
                        columns: [
                            {
                                dataField: 'customization',
                                caption: 'Jersey Details',
                                cellTemplate: function(container, itemOptions) {
                                    const item = itemOptions.data;
                                    const customization = item.customization || {};
                                    
                                    $('<div>')
                                        .addClass('d-flex align-items-center')
                                        .append(
                                            $('<div>')
                                                .addClass('item-image mr-3')
                                                .append($('<i>').addClass('fas fa-tshirt fa-2x text-primary'))
                                        )
                                        .append(
                                            $('<div>')
                                                .addClass('item-details')
                                                .append(
                                                    $('<div>')
                                                        .addClass('font-weight-bold mb-1')
                                                        .text(`${item.size} - ${item.color}`)
                                                )
                                                .append(
                                                    $('<div>')
                                                        .addClass('item-customization')
                                                        .append(
                                                            customization.name ? 
                                                                $('<span>')
                                                                    .addClass('customization-badge')
                                                                    .append($('<i>').addClass('fas fa-user mr-1'))
                                                                    .append(`${customization.name} #${customization.number}`) : 
                                                                null
                                                        )
                                                        .append(
                                                            customization.patches ? 
                                                                customization.patches.map(patch => 
                                                                    $('<span>')
                                                                        .addClass('customization-badge')
                                                                        .append($('<i>').addClass('fas fa-shield-alt mr-1'))
                                                                        .append(patch.replace(/_/g, ' ').toUpperCase())
                                                                ) : 
                                                                null
                                                        )
                                                )
                                        )
                                        .appendTo(container);
                                }
                            },
                            {
                                dataField: 'quantity',
                                caption: 'Quantity',
                                width: 100
                            },
                            {
                                dataField: 'unit_price',
                                caption: 'Unit Price',
                                width: 120,
                                cellTemplate: function(container, itemOptions) {
                                    $('<div>')
                                        .text(`$${itemOptions.value.toFixed(2)}`)
                                        .appendTo(container);
                                }
                            },
                            {
                                dataField: 'final_subtotal',
                                caption: 'Total',
                                width: 120,
                                cellTemplate: function(container, itemOptions) {
                                    $('<div>')
                                        .addClass('font-weight-bold text-primary')
                                        .text(`$${itemOptions.value.toFixed(2)}`)
                                        .appendTo(container);
                                }
                            },
                            {
                                dataField: 'production_status',
                                caption: 'Status',
                                cellTemplate: function(container, itemOptions) {
                                    const status = itemOptions.value;
                                    const statusClass = self.getStatusClass(status);
                                    const statusIcon = self.getStatusIcon(status);
                                    
                                    $('<div>')
                                        .addClass(`order-status ${statusClass}`)
                                        .append($('<i>').addClass(`fas ${statusIcon}`))
                                        .append(status.replace(/_/g, ' ').toUpperCase())
                                        .appendTo(container);
                                }
                            }
                        ]
                    });

                    // Production Timeline Section
                    const $timelineSection = $('<div>')
                        .addClass('mt-4')
                        .append(
                            $('<h6>')
                                .addClass('heading-small text-muted mb-3')
                                .text('Production Timeline')
                        );

                    const $timeline = $('<div>').addClass('production-timeline');
                    self.renderProductionTimeline($timeline, options.data);
                    $timelineSection.append($timeline);

                    // Append all sections to the container
                    $detailContent
                        .append($customerInfo)
                        .append($itemsSection)
                        .append($timelineSection);

                    // Append the detail content to the container
                    container.append($detailContent);
                }
            }
        }).dxDataGrid('instance');

        // Add export buttons
        gridUtils.addExportButtons(this.grid, 'orders');
    }

    async loadData() {
        try {
            const data = await vomoAPI.getOrders();
            this.grid.option('dataSource', data);
            this.updateStats(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            DevExpress.ui.notify('Failed to load orders', 'error', 3000);
        }
    }

    updateStats(data = []) {
        // Calculate statistics
        const totalOrders = data.length;
        const inProduction = data.filter(order => order.status === 'in_production').length;
        const pendingOrders = data.filter(order => order.status === 'pending').length;
        const totalRevenue = data.reduce((sum, order) => sum + order.total_amount, 0);

        // Update UI
        $('#totalOrders').text(totalOrders);
        $('#inProduction').text(inProduction);
        $('#pendingOrders').text(pendingOrders);
        $('#totalRevenue').text(`$${totalRevenue.toFixed(2)}`);
    }

    showOrderDetails(order) {
        this.currentOrder = order;
        
        // Update modal title
        $('#orderTitle').text(`Order ${order.order_number}`);
        
        // Update order info
        $('#customerName').text(order.customer_name);
        $('#customerEmail').text(order.customer_email);
        $('#customerPhone').text(order.customer_phone);
        $('#officeId').text(order.office_id);
        $('#deliveryAddress').text(order.delivery_address);
        $('#expectedDelivery').text(new Date(order.expected_delivery_date).toLocaleDateString());
        $('#orderNumber').text(order.order_number);
        $('#createdDate').text(new Date(order.created_at).toLocaleDateString());
        $('#updatedDate').text(new Date(order.updated_at).toLocaleDateString());
        $('#subtotal').text(`$${order.subtotal.toFixed(2)}`);
        $('#discount').text(`-$${order.discount_amount.toFixed(2)}`);
        $('#totalAmount').text(`$${order.total_amount.toFixed(2)}`);
        
        // Update status badges
        this.updateStatusBadge('orderStatus', order.status);
        this.updateStatusBadge('paymentStatus', order.payment_status);
        
        // Initialize order items grid
        this.initializeOrderItemsGrid(order.order_items);
        
        // Show production timeline
        this.showProductionTimeline(order);
        
        // Show modal
        $('#orderDetailsModal').modal('show');
    }

    initializeOrderItemsGrid(items) {
        if (this.orderItemsGrid) {
            this.orderItemsGrid.dispose();
        }

        this.orderItemsGrid = $('#orderItemsGrid').dxDataGrid({
            dataSource: items,
            showBorders: true,
            columns: [
                {
                    dataField: 'customization',
                    caption: 'Jersey Details',
                    cellTemplate: (container, options) => {
                        const item = options.data;
                        const customization = item.customization || {};
                        
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<div>')
                                    .addClass('item-image mr-3')
                                    .append($('<i>').addClass('fas fa-tshirt fa-2x text-primary'))
                            )
                            .append(
                                $('<div>')
                                    .addClass('item-details')
                                    .append(
                                        $('<div>')
                                            .addClass('font-weight-bold mb-1')
                                            .text(`${item.size} - ${item.color}`)
                                    )
                                    .append(
                                        $('<div>')
                                            .addClass('item-customization')
                                            .append(
                                                customization.name ? 
                                                    $('<span>')
                                                        .addClass('customization-badge')
                                                        .append($('<i>').addClass('fas fa-user mr-1'))
                                                        .append(`${customization.name} #${customization.number}`) : 
                                                    null
                                            )
                                            .append(
                                                customization.patches ? 
                                                    customization.patches.map(patch => 
                                                        $('<span>')
                                                            .addClass('customization-badge')
                                                            .append($('<i>').addClass('fas fa-shield-alt mr-1'))
                                                            .append(patch.replace(/_/g, ' ').toUpperCase())
                                                    ) : 
                                                    null
                                            )
                                    )
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'quantity',
                    caption: 'Quantity',
                    width: 100,
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('font-weight-bold')
                            .text(options.value)
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'unit_price',
                    caption: 'Unit Price',
                    width: 120,
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('font-weight-bold')
                            .text(`$${options.value.toFixed(2)}`)
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'discount_amount',
                    caption: 'Discount',
                    width: 120,
                    cellTemplate: (container, options) => {
                        if (options.value > 0) {
                            $('<div>')
                                .addClass('text-success font-weight-bold')
                                .text(`-$${options.value.toFixed(2)}`)
                                .appendTo(container);
                        } else {
                            $('<div>')
                                .addClass('text-muted')
                                .text('-')
                                .appendTo(container);
                        }
                    }
                },
                {
                    dataField: 'final_subtotal',
                    caption: 'Total',
                    width: 120,
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('font-weight-bold text-primary')
                            .text(`$${options.value.toFixed(2)}`)
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'production_status',
                    caption: 'Status',
                    width: 150,
                    cellTemplate: (container, options) => {
                        const status = options.value;
                        const statusClass = this.getStatusClass(status);
                        const statusIcon = this.getStatusIcon(status);
                        
                        $('<div>')
                            .addClass(`order-status ${statusClass}`)
                            .append($('<i>').addClass(`fas ${statusIcon}`))
                            .append(status.replace(/_/g, ' ').toUpperCase())
                            .appendTo(container);
                    }
                }
            ],
            summary: {
                totalItems: [{
                    column: 'final_subtotal',
                    summaryType: 'sum',
                    valueFormat: {
                        type: 'currency',
                        precision: 2
                    },
                    customizeText: (data) => {
                        return `Total: $${data.value.toFixed(2)}`;
                    }
                }]
            }
        }).dxDataGrid('instance');
    }

    renderProductionTimeline($container, order) {
        $container.empty();

        // Get production status from order items
        const getProductionDetails = () => {
            const tasks = order.order_items.map(item => ({
                task: item.current_task,
                status: item.production_status
            }));

            // Check if any items are still in production
            const inProduction = tasks.some(t => t.status === 'in_progress');
            // Get current tasks
            const currentTasks = [...new Set(tasks.map(t => t.task))].join(', ');

            return { inProduction, currentTasks };
        };

        const productionDetails = getProductionDetails();

        const stages = [
            { 
                id: 'pending', 
                name: 'Order Received', 
                icon: 'shopping-cart', 
                date: order.created_at,
                description: 'Order placed by customer',
                isActive: true // Always active as it's the first stage
            },
            { 
                id: 'confirmed', 
                name: 'Order Confirmed', 
                icon: 'check-circle', 
                date: order.status !== 'pending' ? order.updated_at : null,
                description: 'Order verified and confirmed',
                isActive: order.status !== 'pending'
            },
            { 
                id: 'in_production', 
                name: 'In Production', 
                icon: 'cogs', 
                date: order.status === 'in_production' ? order.updated_at : null,
                description: productionDetails.currentTasks 
                    ? `Current tasks: ${productionDetails.currentTasks}`
                    : 'Jersey customization in progress',
                isActive: order.status === 'in_production',
                isCurrent: true
            }
        ];

        // Only show completed stages and current stage
        const visibleStages = stages;

        const timelineStyles = document.createElement('style');
        timelineStyles.setAttribute('data-timeline-styles', '');
        timelineStyles.textContent = `
            .timeline-item { position: relative; padding-left: 2rem; padding-bottom: 2rem; }
            .timeline-badge { position: absolute; left: -8px; width: 20px; height: 20px; border-radius: 50%; background: #e9ecef; border: 2px solid #fff; z-index: 1; }
            .timeline-badge.active { background: #5e72e4; border-color: #fff; box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.2); }
            .timeline-badge.current { animation: pulse 2s infinite; }
            .timeline-connector { position: absolute; left: 1px; top: 20px; bottom: 0; width: 2px; background: #e9ecef; }
            .timeline-connector.active { background: #5e72e4; }
            .timeline-content { background: #fff; border-radius: 0.375rem; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-left: 1rem; }
            .timeline-date { margin-top: 0.5rem; font-size: 0.875rem; }
            .timeline-tasks { margin-top: 0.5rem; font-size: 0.875rem; color: #5e72e4; }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(94, 114, 228, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(94, 114, 228, 0); }
                100% { box-shadow: 0 0 0 0 rgba(94, 114, 228, 0); }
            }
        `;

        if (!document.querySelector('style[data-timeline-styles]')) {
            document.head.appendChild(timelineStyles);
        }

        visibleStages.forEach((stage, index) => {
            const isCurrent = stage.id === order.status;
            
            const $item = $('<div>').addClass('timeline-item');
            const $badge = $('<div>').addClass(`timeline-badge${stage.isActive ? ' active' : ''}${isCurrent ? ' current' : ''}`);
            const $content = $('<div>').addClass('timeline-content');
            
            // Add header
            $content.append(
                $('<div>').addClass('d-flex align-items-center mb-2')
                    .append($('<i>').addClass(`fas fa-${stage.icon} mr-2${stage.isActive ? ' text-primary' : ' text-muted'}`))
                    .append($('<h6>').addClass(`mb-0${stage.isActive ? ' text-primary' : ' text-muted'}`).text(stage.name))
            );

            // Add description
            $content.append($('<p>').addClass('text-muted small mb-1').text(stage.description));

            // Add current tasks if in production
            if (stage.id === 'in_production' && productionDetails.currentTasks) {
                $content.append(
                    $('<div>').addClass('timeline-tasks')
                        .append($('<i>').addClass('fas fa-tasks mr-1'))
                        .append(productionDetails.currentTasks)
                );
            }

            // Add date if available
            if (stage.date) {
                const date = new Date(stage.date);
                $content.append(
                    $('<div>').addClass('timeline-date')
                        .append($('<i>').addClass('far fa-calendar-alt mr-1'))
                        .append($('<small>').addClass('text-muted').text(date.toLocaleDateString()))
                        .append($('<i>').addClass('far fa-clock ml-2 mr-1'))
                        .append($('<small>').addClass('text-muted').text(date.toLocaleTimeString()))
                );
            }

            $item.append($badge).append($content);

            // Add connector line except for the last visible stage
            if (index < visibleStages.length - 1) {
                $item.append($('<div>').addClass(`timeline-connector${stage.isActive ? ' active' : ''}`));
            }

            $container.append($item);
        });

        // Add note about next stages
        if (order.status === 'in_production') {
            $container.append(
                $('<div>').addClass('timeline-note mt-3 text-center text-muted small')
                    .append('Quality Check and Delivery stages will appear after production is complete')
            );
        }
    }

    showProductionTimeline(order) {
        const $timeline = $('.production-timeline');
        $timeline.empty();

        // Get production status from order items
        const getProductionDetails = () => {
            const tasks = order.order_items.map(item => ({
                task: item.current_task,
                status: item.production_status
            }));

            // Check if any items are still in production
            const inProduction = tasks.some(t => t.status === 'in_progress');
            // Get current tasks
            const currentTasks = [...new Set(tasks.map(t => t.task))].join(', ');

            return { inProduction, currentTasks };
        };

        const productionDetails = getProductionDetails();

        const stages = [
            { 
                id: 'pending', 
                name: 'Order Received', 
                icon: 'shopping-cart', 
                date: order.created_at,
                description: 'Order placed by customer',
                isActive: true // Always active as it's the first stage
            },
            { 
                id: 'confirmed', 
                name: 'Order Confirmed', 
                icon: 'check-circle', 
                date: order.status !== 'pending' ? order.updated_at : null,
                description: 'Order verified and confirmed',
                isActive: order.status !== 'pending'
            },
            { 
                id: 'in_production', 
                name: 'In Production', 
                icon: 'cogs', 
                date: order.status === 'in_production' ? order.updated_at : null,
                description: productionDetails.currentTasks 
                    ? `Current tasks: ${productionDetails.currentTasks}`
                    : 'Jersey customization in progress',
                isActive: order.status === 'in_production',
                isCurrent: true
            }
        ];

        // Only show completed stages and current stage
        const visibleStages = stages;

        const timelineStyles = document.createElement('style');
        timelineStyles.setAttribute('data-timeline-styles', '');
        timelineStyles.textContent = `
            .timeline-item { position: relative; padding-left: 2rem; padding-bottom: 2rem; }
            .timeline-badge { position: absolute; left: -8px; width: 20px; height: 20px; border-radius: 50%; background: #e9ecef; border: 2px solid #fff; z-index: 1; }
            .timeline-badge.active { background: #5e72e4; border-color: #fff; box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.2); }
            .timeline-badge.current { animation: pulse 2s infinite; }
            .timeline-connector { position: absolute; left: 1px; top: 20px; bottom: 0; width: 2px; background: #e9ecef; }
            .timeline-connector.active { background: #5e72e4; }
            .timeline-content { background: #fff; border-radius: 0.375rem; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-left: 1rem; }
            .timeline-date { margin-top: 0.5rem; font-size: 0.875rem; }
            .timeline-tasks { margin-top: 0.5rem; font-size: 0.875rem; color: #5e72e4; }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(94, 114, 228, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(94, 114, 228, 0); }
                100% { box-shadow: 0 0 0 0 rgba(94, 114, 228, 0); }
            }
        `;

        if (!document.querySelector('style[data-timeline-styles]')) {
            document.head.appendChild(timelineStyles);
        }

        visibleStages.forEach((stage, index) => {
            const isCurrent = stage.id === order.status;
            
            const $item = $('<div>').addClass('timeline-item');
            const $badge = $('<div>').addClass(`timeline-badge${stage.isActive ? ' active' : ''}${isCurrent ? ' current' : ''}`);
            const $content = $('<div>').addClass('timeline-content');
            
            // Add header
            $content.append(
                $('<div>').addClass('d-flex align-items-center mb-2')
                    .append($('<i>').addClass(`fas fa-${stage.icon} mr-2${stage.isActive ? ' text-primary' : ' text-muted'}`))
                    .append($('<h6>').addClass(`mb-0${stage.isActive ? ' text-primary' : ' text-muted'}`).text(stage.name))
            );

            // Add description
            $content.append($('<p>').addClass('text-muted small mb-1').text(stage.description));

            // Add current tasks if in production
            if (stage.id === 'in_production' && productionDetails.currentTasks) {
                $content.append(
                    $('<div>').addClass('timeline-tasks')
                        .append($('<i>').addClass('fas fa-tasks mr-1'))
                        .append(productionDetails.currentTasks)
                );
            }

            // Add date if available
            if (stage.date) {
                const date = new Date(stage.date);
                $content.append(
                    $('<div>').addClass('timeline-date')
                        .append($('<i>').addClass('far fa-calendar-alt mr-1'))
                        .append($('<small>').addClass('text-muted').text(date.toLocaleDateString()))
                        .append($('<i>').addClass('far fa-clock ml-2 mr-1'))
                        .append($('<small>').addClass('text-muted').text(date.toLocaleTimeString()))
                );
            }

            $item.append($badge).append($content);

            // Add connector line except for the last visible stage
            if (index < visibleStages.length - 1) {
                $item.append($('<div>').addClass(`timeline-connector${stage.isActive ? ' active' : ''}`));
            }

            $timeline.append($item);
        });

        // Add note about next stages
        if (order.status === 'in_production') {
            $timeline.append(
                $('<div>').addClass('timeline-note mt-3 text-center text-muted small')
                    .append('Quality Check and Delivery stages will appear after production is complete')
            );
        }
    }

    updateStatusBadge(elementId, status) {
        const $badge = $(`#${elementId}`);
        const statusClass = this.getStatusClass(status);
        const statusIcon = this.getStatusIcon(status);
        
        $badge
            .removeClass()
            .addClass(`badge badge-dot mr-4 ${statusClass}`)
            .find('.status')
            .html(`<i class="fas ${statusIcon} mr-1"></i>${status.replace(/_/g, ' ').toUpperCase()}`);
    }

    getStatusClass(status) {
        const statusClasses = {
            pending: 'pending',
            confirmed: 'in-production',
            in_production: 'in-production',
            quality_check: 'in-production',
            ready_for_delivery: 'completed',
            delivered: 'completed',
            cancelled: 'cancelled'
        };
        return statusClasses[status] || 'pending';
    }

    getStatusIcon(status) {
        const statusIcons = {
            pending: 'fa-clock',
            confirmed: 'fa-check',
            in_production: 'fa-cogs',
            quality_check: 'fa-clipboard-check',
            ready_for_delivery: 'fa-box',
            delivered: 'fa-truck',
            cancelled: 'fa-times'
        };
        return statusIcons[status] || 'fa-clock';
    }

    getPaymentClass(status) {
        const paymentClasses = {
            paid: 'paid',
            partial: 'partial',
            unpaid: 'unpaid'
        };
        return paymentClasses[status] || 'unpaid';
    }

    getPaymentIcon(status) {
        const paymentIcons = {
            paid: 'fa-check-circle',
            partial: 'fa-clock',
            unpaid: 'fa-times-circle'
        };
        return paymentIcons[status] || 'fa-times-circle';
    }

    clearOrderDetails() {
        // Clear all dynamic content
        $('#orderItemsGrid').empty();
        $('.production-timeline').empty();
        $('.payment-history').empty();
    }

    editOrder() {
        if (this.currentOrder) {
            // Implement edit functionality
            console.log('Edit order:', this.currentOrder);
        }
    }

    updateOrderStatus() {
        if (this.currentOrder) {
            // Implement status update functionality
            console.log('Update status for order:', this.currentOrder);
        }
    }

    printOrder() {
        if (this.currentOrder) {
            // Implement print functionality
            console.log('Print order:', this.currentOrder);
        }
    }

    cancelOrder() {
        if (this.currentOrder) {
            DevExpress.ui.dialog.confirm(
                'Are you sure you want to cancel this order?',
                'Confirm Cancellation'
            ).then((result) => {
                if (result) {
                    // Implement cancel functionality
                    console.log('Cancel order:', this.currentOrder);
                }
            });
        }
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.orderPageInstance) {
    window.orderPageInstance = new window.OrderPage();
} 