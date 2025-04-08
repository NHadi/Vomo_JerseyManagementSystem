import { vomoAPI } from '../api/index.js';
import { gridUtils } from '../utils/gridUtils.js';

// Define PaymentPage
window.PaymentPage = class {
    constructor() {
        this.grid = null;
        this.exportButtonsAdded = false;
        this.showPending = false;
        this.payments = [];
        this.currentPayment = null;
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();

        // Add styles
        $('<style>')
        .text(`
            /* Payment Status Badges */
            .payment-status {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.75rem;
                font-weight: 600;
            }

            .payment-status.completed {
                background-color: rgba(45, 206, 137, 0.1);
                color: #2dce89;
            }

            .payment-status.pending {
                background-color: rgba(251, 99, 64, 0.1);
                color: #fb6340;
            }

            .payment-status.failed {
                background-color: rgba(245, 54, 92, 0.1);
                color: #f5365c;
            }

            /* Payment Method Badge */
            .payment-method {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.75rem;
                font-weight: 600;
                background-color: rgba(94, 114, 228, 0.1);
                color: #5e72e4;
            }

            .payment-method i {
                margin-right: 0.5rem;
            }

            /* Reference Number */
            .reference-number {
                display: inline-flex;
                align-items: center;
                font-weight: 600;
                color: #5e72e4;
            }

            .reference-number i {
                margin-right: 0.5rem;
            }

            /* Amount Display */
            .amount-display {
                font-weight: 600;
                color: #2dce89;
            }

            .amount-display.negative {
                color: #f5365c;
            }

            /* Payment Details Modal */
            .payment-details-header {
                background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
                color: white;
                padding: 2rem;
                border-radius: 0.375rem;
                margin-bottom: 2rem;
            }

            .payment-details-header h3 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .payment-info-card {
                background: white;
                border-radius: 0.375rem;
                box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
                margin-bottom: 2rem;
            }

            .payment-info-card .card-header {
                padding: 1.25rem 1.5rem;
                border-bottom: 1px solid #e9ecef;
                background: transparent;
            }

            .payment-info-card .card-header h5 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
                color: #32325d;
            }

            .payment-info-card .card-body {
                padding: 1.5rem;
            }

            .info-group {
                margin-bottom: 1.5rem;
            }

            .info-group:last-child {
                margin-bottom: 0;
            }

            .info-label {
                font-size: 0.875rem;
                color: #8898aa;
                margin-bottom: 0.5rem;
            }

            .info-value {
                font-size: 0.875rem;
                color: #32325d;
                font-weight: 600;
            }

            /* Timeline Styles */
            .payment-timeline {
                position: relative;
                padding-left: 2rem;
            }

            .timeline-item {
                position: relative;
                padding-bottom: 1.5rem;
                padding-left: 1.5rem;
            }

            .timeline-item:before {
                content: '';
                position: absolute;
                left: -2px;
                top: 0;
                bottom: 0;
                width: 2px;
                background: #e9ecef;
            }

            .timeline-item:last-child {
                padding-bottom: 0;
            }

            .timeline-item:last-child:before {
                display: none;
            }

            .timeline-point {
                position: absolute;
                left: -8px;
                top: 0;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 2px solid #5e72e4;
                background: white;
            }

            .timeline-content {
                background: white;
                border-radius: 0.375rem;
                padding: 1rem;
                box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
            }

            .timeline-title {
                font-size: 0.875rem;
                font-weight: 600;
                color: #32325d;
                margin-bottom: 0.5rem;
            }

            .timeline-info {
                font-size: 0.875rem;
                color: #8898aa;
            }

            /* Transaction History */
            .transaction-item {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e9ecef;
            }

            .transaction-item:last-child {
                border-bottom: none;
            }

            .transaction-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(94, 114, 228, 0.1);
                color: #5e72e4;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
            }

            .transaction-details {
                flex: 1;
            }

            .transaction-amount {
                font-weight: 600;
                color: #2dce89;
            }

            .transaction-amount.refund {
                color: #f5365c;
            }
        `)
        .appendTo('head');
    }

    dispose() {
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
        // Clean up event listeners
        $('#btnShowPending').off('click');
        $('#btnGroupByStatus').off('click');
        $('#paymentDetailsModal').off('show.bs.modal');
        $('#paymentDetailsModal').off('hide.bs.modal');
        $('#printReceipt').off('click');
        $('#updateStatus').off('click');
        $('#voidPayment').off('click');
        $('.nav-tabs .nav-link').off('click');
    }

    bindEvents() {
        $('#btnShowPending').on('click', () => {
            this.showPending = !this.showPending;
            this.updateGridData();
            $('#btnShowPending i').toggleClass('fa-clock fa-history');
        });

        $('#btnGroupByStatus').on('click', () => {
            const groupPanel = this.grid.option('groupPanel');
            if (groupPanel.visible) {
                this.grid.clearGrouping();
            }
            this.grid.option('groupPanel.visible', !groupPanel.visible);
        });

        // Modal events
        $('#paymentDetailsModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const paymentId = button.data('payment-id');
            if (paymentId) {
                this.loadPaymentDetails(paymentId);
            }
        });

        $('#paymentDetailsModal').on('hide.bs.modal', () => {
            this.currentPayment = null;
            this.clearPaymentDetails();
        });

        // Action buttons
        $('#printReceipt').on('click', () => {
            if (this.currentPayment) {
                this.printReceipt(this.currentPayment);
            }
        });

        $('#updateStatus').on('click', () => {
            if (this.currentPayment) {
                this.updatePaymentStatus(this.currentPayment);
            }
        });

        $('#voidPayment').on('click', () => {
            if (this.currentPayment) {
                this.voidPayment(this.currentPayment);
            }
        });

        // Tab switching
        $('.nav-tabs .nav-link').on('click', (e) => {
            e.preventDefault();
            const tab = $(e.currentTarget).data('tab');
            this.switchTab(tab);
        });
    }

    initialize() {
        this.initializeGrid();
        this.loadData();
    }

    initializeGrid() {
        const gridElement = $('#paymentGrid');
        if (!gridElement.length) {
            console.error('Payment grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#paymentGrid').dxDataGrid({
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
                    dataField: 'reference_number',
                    caption: 'Payment Info',
                    cellTemplate: (container, options) => {
                        const payment = options.data;
                        $('<div>')
                            .addClass('d-flex flex-column')
                            .append(
                                $('<div>')
                                    .addClass('reference-number')
                                    .append($('<i>').addClass('ni ni-tag'))
                                    .append(payment.reference_number)
                            )
                            .append(
                                $('<small>')
                                    .addClass('text-muted')
                                    .text(new Date(payment.payment_date).toLocaleDateString())
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'payment_method',
                    caption: 'Method',
                    cellTemplate: (container, options) => {
                        const methodIcons = {
                            'bank_transfer': 'ni ni-building',
                            'credit_card': 'ni ni-credit-card',
                            'cash': 'ni ni-money-coins',
                            'digital_wallet': 'ni ni-mobile-button'
                        };
                        const icon = methodIcons[options.value] || 'ni ni-money-coins';
                        const displayText = options.value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                        
                        $('<div>')
                            .addClass('payment-method')
                            .append($('<i>').addClass(icon))
                            .append(displayText)
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'amount',
                    caption: 'Amount',
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('amount-display')
                            .text(`$${options.value.toFixed(2)}`)
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'status',
                    caption: 'Status',
                    cellTemplate: (container, options) => {
                        const statusIcons = {
                            'completed': 'fas fa-check',
                            'pending': 'fas fa-clock',
                            'failed': 'fas fa-times'
                        };
                        
                        $('<div>')
                            .addClass(`payment-status ${options.value}`)
                            .append($('<i>').addClass(statusIcons[options.value] + ' mr-1'))
                            .append(options.value.charAt(0).toUpperCase() + options.value.slice(1))
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'notes',
                    caption: 'Notes',
                    cellTemplate: (container, options) => {
                        if (options.value) {
                            $('<div>')
                                .addClass('text-muted text-small')
                                .text(options.value)
                                .appendTo(container);
                        }
                    }
                },
                {
                    type: 'buttons',
                    width: 110,
                    buttons: [{
                        hint: 'View Details',
                        icon: 'fas fa-eye',
                        onClick: (e) => {
                            this.showPaymentDetails(e.row.data);
                        }
                    }, {
                        hint: 'Print Receipt',
                        icon: 'fas fa-print',
                        onClick: (e) => {
                            this.printReceipt(e.row.data);
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
                template: (container, options) => {
                    this.renderPaymentDetails(container, options.data);
                }
            },
            onContentReady: (e) => {
                if (this.grid && !this.exportButtonsAdded) {
                    gridUtils.addExportButtons(this.grid, 'Payment_List');
                    this.exportButtonsAdded = true;
                }
                this.updateStats();
            }
        }).dxDataGrid('instance');
    }

    renderPaymentDetails(container, payment) {
        const $detailContent = $('<div>').addClass('payment-detail-container p-4');

        // Payment Information Section
        const $paymentInfo = $('<div>')
            .addClass('payment-info-card')
            .append(
                $('<div>')
                    .addClass('card-header')
                    .append($('<h5>').text('Payment Information'))
            )
            .append(
                $('<div>')
                    .addClass('card-body')
                    .append(this.createInfoGroup('Reference Number', payment.reference_number))
                    .append(this.createInfoGroup('Payment Method', this.formatPaymentMethod(payment.payment_method)))
                    .append(this.createInfoGroup('Amount', `$${payment.amount.toFixed(2)}`))
                    .append(this.createInfoGroup('Status', this.formatStatus(payment.status)))
                    .append(this.createInfoGroup('Payment Date', new Date(payment.payment_date).toLocaleString()))
            );

        // Transaction Timeline
        const $timeline = $('<div>')
            .addClass('payment-info-card')
            .append(
                $('<div>')
                    .addClass('card-header')
                    .append($('<h5>').text('Transaction Timeline'))
            )
            .append(
                $('<div>')
                    .addClass('card-body')
                    .append(this.createTimeline(payment))
            );

        // Notes Section (if available)
        if (payment.notes) {
            const $notes = $('<div>')
                .addClass('payment-info-card')
                .append(
                    $('<div>')
                        .addClass('card-header')
                        .append($('<h5>').text('Notes'))
                )
                .append(
                    $('<div>')
                        .addClass('card-body')
                        .append($('<p>').addClass('mb-0').text(payment.notes))
                );
            $detailContent.append($notes);
        }

        $detailContent.append($paymentInfo).append($timeline);
        container.append($detailContent);
    }

    createInfoGroup(label, value) {
        return $('<div>')
            .addClass('info-group')
            .append($('<div>').addClass('info-label').text(label))
            .append($('<div>').addClass('info-value').html(value));
    }

    createTimeline(payment) {
        const $timeline = $('<div>').addClass('payment-timeline');

        // Created
        $timeline.append(this.createTimelineItem(
            'Payment Created',
            `Payment initiated via ${this.formatPaymentMethod(payment.payment_method)}`,
            payment.created_at
        ));

        // Processing
        $timeline.append(this.createTimelineItem(
            'Processing',
            'Payment is being processed',
            payment.payment_date
        ));

        // Completed/Failed
        if (payment.status === 'completed') {
            $timeline.append(this.createTimelineItem(
                'Payment Completed',
                `Successfully processed payment of $${payment.amount.toFixed(2)}`,
                payment.updated_at
            ));
        } else if (payment.status === 'failed') {
            $timeline.append(this.createTimelineItem(
                'Payment Failed',
                'Transaction could not be completed',
                payment.updated_at
            ));
        }

        return $timeline;
    }

    createTimelineItem(title, info, date) {
        return $('<div>')
            .addClass('timeline-item')
            .append($('<div>').addClass('timeline-point'))
            .append(
                $('<div>')
                    .addClass('timeline-content')
                    .append($('<div>').addClass('timeline-title').text(title))
                    .append($('<div>').addClass('timeline-info').text(info))
                    .append(
                        $('<small>')
                            .addClass('text-muted d-block mt-2')
                            .text(new Date(date).toLocaleString())
                    )
            );
    }

    formatPaymentMethod(method) {
        const methodIcons = {
            'bank_transfer': 'ni ni-building',
            'credit_card': 'ni ni-credit-card',
            'cash': 'ni ni-money-coins',
            'digital_wallet': 'ni ni-mobile-button'
        };
        const icon = methodIcons[method] || 'ni ni-money-coins';
        const displayText = method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return `<i class="${icon} mr-2"></i>${displayText}`;
    }

    formatStatus(status) {
        const statusIcons = {
            'completed': 'fas fa-check',
            'pending': 'fas fa-clock',
            'failed': 'fas fa-times'
        };
        const icon = statusIcons[status] || 'fas fa-question';
        return `<div class="payment-status ${status}"><i class="${icon} mr-1"></i>${status.charAt(0).toUpperCase() + status.slice(1)}</div>`;
    }

    updateStats() {
        const payments = this.grid.getDataSource().items();
        const totalPayments = payments.length;
        const completedPayments = payments.filter(p => p.status === 'completed').length;
        const pendingPayments = payments.filter(p => p.status === 'pending').length;
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        $('#totalPayments').text(totalPayments);
        $('#completedPayments').text(completedPayments);
        $('#pendingPayments').text(pendingPayments);
        $('#totalAmount').text('$' + totalAmount.toFixed(2));
    }

    updateGridData() {
        const filteredData = this.showPending ? 
            this.payments.filter(payment => payment.status === 'pending') : 
            this.payments;
        this.grid.option('dataSource', filteredData);
    }

    async loadData() {
        try {
            this.payments = await vomoAPI.getPayments();
            this.updateGridData();
        } catch (error) {
            console.error('Error loading payments:', error);
            DevExpress.ui.notify('Failed to load payments', 'error', 3000);
        }
    }

    showPaymentDetails(payment) {
        this.currentPayment = payment;
        $('#paymentDetailsModal').modal('show');
        this.updatePaymentDetails(payment);
    }

    updatePaymentDetails(payment) {
        // Update payment info
        $('#referenceNumber').text(payment.reference_number);
        $('#paymentMethod').html(this.formatPaymentMethod(payment.payment_method));
        $('#paymentDate').text(new Date(payment.payment_date).toLocaleString());
        $('#paymentAmount').text(`$${payment.amount.toFixed(2)}`);
        $('#paymentNotes').text(payment.notes || 'No notes available');
        
        // Update status badge
        const statusBadge = $('#paymentStatus');
        statusBadge.find('.status').text(payment.status.charAt(0).toUpperCase() + payment.status.slice(1));
        statusBadge.find('i').removeClass().addClass(`bg-${this.getStatusColor(payment.status)}`);

        // Update timeline
        this.updateTimeline(payment);

        // Update transaction summary
        this.updateTransactionSummary(payment);

        // Update order info if available
        if (payment.order) {
            this.updateOrderInfo(payment.order);
        }
    }

    updateTimeline(payment) {
        const $timeline = $('.payment-timeline');
        $timeline.empty();

        const timeline = this.createTimeline(payment);
        $timeline.append(timeline);
    }

    updateTransactionSummary(payment) {
        const $summary = $('.transaction-summary');
        $summary.empty();

        const $transaction = $('<div>')
            .addClass('transaction-item')
            .append(
                $('<div>')
                    .addClass('transaction-icon')
                    .append($('<i>').addClass(this.getPaymentMethodIcon(payment.payment_method)))
            )
            .append(
                $('<div>')
                    .addClass('transaction-details')
                    .append($('<div>').addClass('font-weight-bold').text(this.formatPaymentMethod(payment.payment_method)))
                    .append($('<small>').addClass('text-muted').text(new Date(payment.payment_date).toLocaleString()))
            )
            .append(
                $('<div>')
                    .addClass('transaction-amount')
                    .text(`$${payment.amount.toFixed(2)}`)
            );

        $summary.append($transaction);
    }

    updateOrderInfo(order) {
        const $orderInfo = $('.order-info');
        $orderInfo.empty();

        const $orderDetails = $('<div>')
            .addClass('card shadow-none border')
            .append(
                $('<div>')
                    .addClass('card-body')
                    .append(
                        $('<h6>').addClass('heading-small text-muted mb-4').text('Order Information')
                    )
                    .append(
                        $('<div>')
                            .addClass('pl-lg-4')
                            .append(this.createInfoGroup('Order Number', order.order_number))
                            .append(this.createInfoGroup('Customer', order.customer_name))
                            .append(this.createInfoGroup('Total Amount', `$${order.total_amount.toFixed(2)}`))
                            .append(this.createInfoGroup('Status', this.formatOrderStatus(order.status)))
                    )
            );

        $orderInfo.append($orderDetails);
    }

    getStatusColor(status) {
        const colors = {
            'completed': 'success',
            'pending': 'warning',
            'failed': 'danger'
        };
        return colors[status] || 'secondary';
    }

    getPaymentMethodIcon(method) {
        const icons = {
            'bank_transfer': 'ni ni-building',
            'credit_card': 'ni ni-credit-card',
            'cash': 'ni ni-money-coins',
            'digital_wallet': 'ni ni-mobile-button'
        };
        return icons[method] || 'ni ni-money-coins';
    }

    formatOrderStatus(status) {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    clearPaymentDetails() {
        // Clear all dynamic content
        $('#referenceNumber').text('');
        $('#paymentMethod').html('');
        $('#paymentDate').text('');
        $('#paymentAmount').text('');
        $('#paymentNotes').text('');
        $('.payment-timeline').empty();
        $('.transaction-summary').empty();
        $('.order-info').empty();
    }

    switchTab(tab) {
        $('.nav-tabs .nav-link').removeClass('active');
        $(`.nav-tabs .nav-link[data-tab="${tab}"]`).addClass('active');
        $('.tab-pane').removeClass('show active');
        $(`#${tab}`).addClass('show active');
    }

    async updatePaymentStatus(payment) {
        // Implement status update functionality
        console.log('Update status for payment:', payment);
    }

    async voidPayment(payment) {
        // Implement void payment functionality
        console.log('Void payment:', payment);
    }

    printReceipt(payment) {
        // Implement receipt printing functionality
        console.log('Print receipt for payment:', payment);
    }
};

// Initialize only if DevExpress is loaded
if (typeof DevExpress !== 'undefined' && !window.paymentPageInstance) {
    window.paymentPageInstance = new window.PaymentPage();
} 