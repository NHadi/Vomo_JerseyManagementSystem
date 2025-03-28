import { vomoAPI } from '../api/index.js';

// Define ProductPage
window.ProductPage = class {
    constructor() {
        this.grid = null;
        this.selectedCategory = null;
        this.currentProduct = null;
        this.allCategories = [];
        this.categoryFilter = '';
        
        // Initialize components
        if (typeof DevExpress !== 'undefined') {
            this.initialize();
        }
        
        // Bind event handlers
        this.bindEvents();
    }

    dispose() {
        // Clean up event listeners
        $('#categoryModal').off('show.bs.modal');
        $('#categoryModal').off('hide.bs.modal');
        $('#categorySearchBox').off('input');
        $('#saveCategory').off('click');

        // Dispose of the grid
        if (this.grid) {
            this.grid.dispose();
            this.grid = null;
        }
    }

    bindEvents() {
        // Modal show event
        $('#categoryModal').on('show.bs.modal', (event) => {
            const button = $(event.relatedTarget);
            const productId = button.data('product-id');
            const productName = button.data('product-name');
            this.currentProduct = { id: productId, name: productName };
            this.loadCategories(productId);
        });

        // Modal hide event
        $('#categoryModal').on('hide.bs.modal', () => {
            this.selectedCategory = null;
            this.categoryFilter = '';
            $('#categorySearchBox').val('');
            $('.category-list').empty();
        });

        // Category search
        $('#categorySearchBox').on('input', (e) => {
            this.categoryFilter = e.target.value.toLowerCase();
            this.renderCategories();
        });

        // Save category
        $('#saveCategory').on('click', () => this.saveCategory());
    }

    initialize() {
        const gridElement = $('#productGrid');
        if (!gridElement.length) {
            console.error('Product grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        this.grid = $('#productGrid').dxDataGrid({
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
                    caption: 'Product Name',
                    validationRules: [{ type: 'required' }],
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex align-items-center')
                            .append(
                                $('<i>').addClass('ni ni-box mr-2 text-primary')
                            )
                            .append(
                                $('<div>')
                                    .addClass('d-flex flex-column')
                                    .append(
                                        $('<span>').addClass('font-weight-bold').text(options.data.name || '')
                                    )
                                    .append(
                                        $('<small>').addClass('text-muted').text(options.data.code || '')
                                    )
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'category',
                    caption: 'Category',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate: (container, options) => {
                        const $container = $('<div>').addClass('product-container');
                        
                        if (options.data.category) {
                            $('<span>')
                                .addClass('product-badge')
                                .append(
                                    $('<i>').addClass('fas fa-tag')
                                )
                                .append(
                                    $('<span>').text(' ' + options.data.category.name)
                                )
                                .appendTo($container);
                        } else {
                            $('<div>')
                                .addClass('text-muted small')
                                .append(
                                    $('<i>').addClass('fas fa-info-circle mr-1')
                                )
                                .append(
                                    $('<span>').text('No category assigned')
                                )
                                .appendTo($container);
                        }
                        
                        $container.appendTo(container);
                    }
                },
                {
                    dataField: 'size_available',
                    caption: 'Sizes',
                    allowFiltering: false,
                    cellTemplate: (container, options) => {
                        const sizes = options.data.size_available || [];
                        const $container = $('<div>').addClass('d-flex flex-wrap gap-1');
                        
                        sizes.forEach(size => {
                            $('<span>')
                                .addClass('badge badge-soft-primary')
                                .text(size)
                                .appendTo($container);
                        });
                        
                        $container.appendTo(container);
                    }
                },
                {
                    dataField: 'customization_options',
                    caption: 'Customization',
                    allowFiltering: false,
                    cellTemplate: (container, options) => {
                        const customOptions = options.data.customization_options || {};
                        const $container = $('<div>').addClass('d-flex flex-wrap gap-2');
                        
                        Object.entries(customOptions).forEach(([key, value]) => {
                            if (value) {
                                $('<span>')
                                    .addClass('badge badge-soft-success')
                                    .append($('<i>').addClass('fas fa-check mr-1'))
                                    .append(key.charAt(0).toUpperCase() + key.slice(1))
                                    .appendTo($container);
                            }
                        });
                        
                        $container.appendTo(container);
                    }
                },
                {
                    dataField: 'base_price',
                    caption: 'Price Info',
                    cellTemplate: (container, options) => {
                        const $container = $('<div>').addClass('d-flex flex-column');
                        
                        $('<div>')
                            .addClass('font-weight-bold')
                            .text(`$${options.data.base_price.toFixed(2)}`)
                            .appendTo($container);
                            
                        if (options.data.bulk_discount_rules) {
                            $('<small>')
                                .addClass('text-success')
                                .append($('<i>').addClass('fas fa-tag mr-1'))
                                .append('Bulk discounts available')
                                .appendTo($container);
                        }
                        
                        $container.appendTo(container);
                    }
                },
                {
                    dataField: 'production_time',
                    caption: 'Production',
                    cellTemplate: (container, options) => {
                        $('<div>')
                            .addClass('d-flex flex-column')
                            .append(
                                $('<div>')
                                    .append($('<i>').addClass('fas fa-clock mr-1'))
                                    .append(`${options.data.production_time} days`)
                            )
                            .append(
                                $('<small>')
                                    .addClass('text-muted')
                                    .append(`Min. Order: ${options.data.min_order_quantity}`)
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'stock_status',
                    caption: 'Status',
                    cellTemplate: (container, options) => {
                        const status = options.data.stock_status;
                        const statusClass = status === 'in_stock' ? 'text-success' : 'text-danger';
                        const statusIcon = status === 'in_stock' ? 'fa-check-circle' : 'fa-times-circle';
                        
                        $('<div>')
                            .addClass(`d-flex align-items-center ${statusClass}`)
                            .append(
                                $('<i>').addClass(`fas ${statusIcon} mr-2`)
                            )
                            .append(
                                $('<span>').text(status.replace('_', ' ').toUpperCase())
                            )
                            .appendTo(container);
                    }
                },
                {
                    type: 'buttons',
                    width: 140,
                    alignment: 'center',
                    cellTemplate: (container, options) => {
                        const $buttonContainer = $('<div>')
                            .addClass('d-flex justify-content-end align-items-center');

                        // View Details Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-secondary mr-2')
                            .attr('title', 'View Details')
                            .append($('<i>').addClass('fas fa-eye'))
                            .on('click', () => {
                                this.showProductDetails(options.data);
                            })
                            .appendTo($buttonContainer);

                        // Edit Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-info mr-2')
                            .attr('title', 'Edit Product')
                            .append($('<i>').addClass('fas fa-edit'))
                            .on('click', () => {
                                this.grid.editRow(options.rowIndex);
                            })
                            .appendTo($buttonContainer);

                        // Delete Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-danger')
                            .attr('title', 'Delete Product')
                            .append($('<i>').addClass('fas fa-trash'))
                            .on('click', () => {
                                DevExpress.ui.dialog.confirm("Are you sure you want to delete this product?", "Confirm deletion")
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
            masterDetail: {
                enabled: true,
                template: (container, options) => {
                    const product = options.data;
                    
                    $('<div>')
                        .addClass('p-4 bg-light rounded')
                        .append(`
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card shadow-sm">
                                        <div class="card-body">
                                            <h6 class="card-title text-uppercase text-muted mb-3">
                                                <i class="fas fa-box-open mr-2"></i>Product Details
                                            </h6>
                                            <div class="mb-2">
                                                <small class="text-muted">Material</small>
                                                <div class="font-weight-bold">${product.material}</div>
                                            </div>
                                            <div class="mb-2">
                                                <small class="text-muted">Weight</small>
                                                <div class="font-weight-bold">${product.weight}g</div>
                                            </div>
                                            <div>
                                                <small class="text-muted">Description</small>
                                                <div class="text-muted">${product.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card shadow-sm">
                                        <div class="card-body">
                                            <h6 class="card-title text-uppercase text-muted mb-3">
                                                <i class="fas fa-palette mr-2"></i>Available Options
                                            </h6>
                                            <div class="mb-3">
                                                <small class="text-muted d-block mb-2">Sizes</small>
                                                <div class="d-flex flex-wrap gap-2">
                                                    ${(product.size_available || []).map(size => 
                                                        `<span class="badge badge-soft-primary">${size}</span>`
                                                    ).join('')}
                                                </div>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block mb-2">Colors</small>
                                                <div class="d-flex flex-wrap gap-2">
                                                    ${(product.color_options || []).map(color => 
                                                        `<span class="badge badge-soft-info">${color}</span>`
                                                    ).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card shadow-sm">
                                        <div class="card-body">
                                            <h6 class="card-title text-uppercase text-muted mb-3">
                                                <i class="fas fa-tags mr-2"></i>Bulk Discounts
                                            </h6>
                                            <div class="table-responsive">
                                                <table class="table table-sm mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Quantity</th>
                                                            <th>Discount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${Object.entries(product.bulk_discount_rules || {}).map(([qty, discount]) => `
                                                            <tr>
                                                                <td>≥${qty} units</td>
                                                                <td><span class="text-success">${discount}% off</span></td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)
                        .appendTo(container);
                }
            },
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
                    confirmDeleteMessage: 'Are you sure you want to delete this product?'
                },
                popup: {
                    title: 'Product Information',
                    showTitle: true,
                    width: 700,
                    height: 500
                },
                form: {
                    items: [
                        {
                            itemType: 'group',
                            caption: 'Basic Information',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'name',
                                    validationRules: [{ type: 'required', message: 'Product name is required' }]
                                },
                                {
                                    dataField: 'code',
                                    validationRules: [{ type: 'required', message: 'Product code is required' }]
                                },
                                {
                                    dataField: 'category_id',
                                    label: { text: 'Category' },
                                    editorType: 'dxSelectBox',
                                    editorOptions: {
                                        dataSource: this.allCategories,
                                        displayExpr: 'name',
                                        valueExpr: 'id',
                                        placeholder: 'Select a category'
                                    },
                                    validationRules: [{ type: 'required', message: 'Category is required' }]
                                },
                                {
                                    dataField: 'description',
                                    editorType: 'dxTextArea',
                                    editorOptions: {
                                        height: 90
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Product Details',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'material',
                                    validationRules: [{ type: 'required', message: 'Material is required' }]
                                },
                                {
                                    dataField: 'weight',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        min: 0,
                                        step: 0.1,
                                        suffix: 'g'
                                    }
                                },
                                {
                                    dataField: 'size_available',
                                    editorType: 'dxTagBox',
                                    editorOptions: {
                                        items: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
                                        showSelectionControls: true,
                                        applyValueMode: 'useButtons'
                                    }
                                },
                                {
                                    dataField: 'color_options',
                                    editorType: 'dxTagBox',
                                    editorOptions: {
                                        showSelectionControls: true,
                                        applyValueMode: 'useButtons'
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Pricing & Production',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'base_price',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        format: 'currency',
                                        min: 0,
                                        step: 0.01
                                    },
                                    validationRules: [{ type: 'required', message: 'Base price is required' }]
                                },
                                {
                                    dataField: 'production_time',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        min: 1,
                                        step: 1,
                                        suffix: ' days'
                                    }
                                },
                                {
                                    dataField: 'min_order_quantity',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        min: 1,
                                        step: 1
                                    }
                                },
                                {
                                    dataField: 'stock_status',
                                    editorType: 'dxSelectBox',
                                    editorOptions: {
                                        items: ['in_stock', 'out_of_stock', 'pre_order'],
                                        placeholder: 'Select stock status'
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Customization Options',
                            colCount: 2,
                            items: [
                                {
                                    dataField: 'customization_options.name',
                                    label: { text: 'Name Customization' },
                                    editorType: 'dxSwitch'
                                },
                                {
                                    dataField: 'customization_options.number',
                                    label: { text: 'Number Customization' },
                                    editorType: 'dxSwitch'
                                },
                                {
                                    dataField: 'customization_options.patches',
                                    label: { text: 'Patches Available' },
                                    editorType: 'dxSwitch'
                                },
                                {
                                    dataField: 'customization_options.team_logo',
                                    label: { text: 'Team Logo Available' },
                                    editorType: 'dxSwitch'
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
                            text: 'Add Product',
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
            const data = await vomoAPI.getProducts();
            this.grid.option('dataSource', data);
        } catch (error) {
            console.error('Error loading products:', error);
            DevExpress.ui.notify('Failed to load products', 'error', 3000);
        }
    }

    async loadCategories(productId) {
        try {
            this.allCategories = await vomoAPI.getCategories();
            this.renderCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
            DevExpress.ui.notify('Failed to load categories', 'error', 3000);
        }
    }

    renderCategories() {
        const $categoryList = $('.category-list');
        $categoryList.empty();

        const filteredCategories = this.allCategories.filter(category => 
            category.name.toLowerCase().includes(this.categoryFilter) ||
            category.description?.toLowerCase().includes(this.categoryFilter)
        );

        if (filteredCategories.length === 0) {
            $categoryList.html(`
                <div class="no-categories">
                    <i class="fas fa-search"></i>
                    No categories found matching your search
                </div>
            `);
            return;
        }

        filteredCategories.forEach(category => {
            const isSelected = this.selectedCategory?.id === category.id;
            const $categoryItem = this.createCategoryItem(category, isSelected);
            $categoryList.append($categoryItem);
        });
    }

    createCategoryItem(category, isSelected) {
        return $(`
            <div class="category-item ${isSelected ? 'selected' : ''}" data-category-id="${category.id}">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="category-${category.id}"
                           name="category" ${isSelected ? 'checked' : ''}>
                    <label class="custom-control-label" for="category-${category.id}"></label>
                </div>
                <div class="category-info">
                    <div class="category-name">${category.name}</div>
                    <div class="category-details">${category.description || 'No description provided'}</div>
                </div>
            </div>
        `).on('change', (e) => {
            if (e.target.checked) {
                this.selectedCategory = category;
            }
        });
    }

    async saveCategory() {
        try {
            if (!this.selectedCategory) {
                DevExpress.ui.notify('Please select a category', 'warning', 3000);
                return;
            }

            await vomoAPI.updateProduct(this.currentProduct.id, {
                category_id: this.selectedCategory.id
            });

            $('#categoryModal').modal('hide');
            this.loadData();
            DevExpress.ui.notify('Category assigned successfully', 'success', 3000);
        } catch (error) {
            console.error('Error saving category:', error);
            DevExpress.ui.notify('Failed to assign category', 'error', 3000);
        }
    }

    async handleRowInserting(e) {
        try {
            const result = await vomoAPI.createProduct(e.data);
            e.data.id = result.id;
            DevExpress.ui.notify('Product created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating product:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to create product', 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            await vomoAPI.updateProduct(e.key.id, {...e.oldData, ...e.newData});
            DevExpress.ui.notify('Product updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating product:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to update product', 'error', 3000);
        }
    }

    async handleRowRemoving(e) {
        try {
            await vomoAPI.deleteProduct(e.key.id);
            DevExpress.ui.notify('Product deleted successfully', 'success', 3000);
        } catch (error) {
            console.error('Error deleting product:', error);
            e.cancel = true;
            DevExpress.ui.notify('Failed to delete product', 'error', 3000);
        }
    }

    editProduct(product) {
        const rowIndex = this.grid.getRowIndexByKey(product.id);
        if (rowIndex >= 0) {
            this.grid.editRow(rowIndex);
        }
    }

    deleteProduct(product) {
        const rowIndex = this.grid.getRowIndexByKey(product.id);
        if (rowIndex >= 0) {
            DevExpress.ui.dialog.confirm("Are you sure you want to delete this product?", "Confirm deletion")
                .then((result) => {
                    if (result) {
                        this.grid.deleteRow(rowIndex);
                    }
                });
        }
    }

    showProductDetails(product) {
        const content = `
            <div class="p-4">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h6 class="card-title text-uppercase text-muted mb-3">
                                    <i class="fas fa-info-circle mr-2"></i>Basic Information
                                </h6>
                                <div class="mb-2">
                                    <small class="text-muted">Name</small>
                                    <div class="font-weight-bold">${product.name}</div>
                                </div>
                                <div class="mb-2">
                                    <small class="text-muted">Code</small>
                                    <div class="font-weight-bold">${product.code}</div>
                                </div>
                                <div class="mb-2">
                                    <small class="text-muted">Category</small>
                                    <div class="font-weight-bold">${product.category?.name || 'N/A'}</div>
                                </div>
                                <div class="mb-2">
                                    <small class="text-muted">Material</small>
                                    <div class="font-weight-bold">${product.material}</div>
                                </div>
                                <div>
                                    <small class="text-muted">Weight</small>
                                    <div class="font-weight-bold">${product.weight}g</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h6 class="card-title text-uppercase text-muted mb-3">
                                    <i class="fas fa-dollar-sign mr-2"></i>Pricing & Production
                                </h6>
                                <div class="mb-2">
                                    <small class="text-muted">Base Price</small>
                                    <div class="font-weight-bold">$${product.base_price}</div>
                                </div>
                                <div class="mb-2">
                                    <small class="text-muted">Minimum Order</small>
                                    <div class="font-weight-bold">${product.min_order_quantity} units</div>
                                </div>
                                <div>
                                    <small class="text-muted">Production Time</small>
                                    <div class="font-weight-bold">${product.production_time} days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h6 class="card-title text-uppercase text-muted mb-3">
                                    <i class="fas fa-palette mr-2"></i>Available Options
                                </h6>
                                <div class="mb-3">
                                    <small class="text-muted d-block mb-2">Sizes</small>
                                    <div class="d-flex flex-wrap gap-2">
                                        ${(product.size_available || []).map(size => 
                                            `<span class="badge badge-soft-primary">${size}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                                <div>
                                    <small class="text-muted d-block mb-2">Colors</small>
                                    <div class="d-flex flex-wrap gap-2">
                                        ${(product.color_options || []).map(color => 
                                            `<span class="badge badge-soft-info">${color}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h6 class="card-title text-uppercase text-muted mb-3">
                                    <i class="fas fa-tags mr-2"></i>Bulk Discounts
                                </h6>
                                <div class="table-responsive">
                                    <table class="table table-sm mb-0">
                                        <thead>
                                            <tr>
                                                <th>Quantity</th>
                                                <th>Discount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(product.bulk_discount_rules || {}).map(([qty, discount]) => `
                                                <tr>
                                                    <td>≥${qty} units</td>
                                                    <td><span class="text-success">${discount}% off</span></td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h6 class="card-title text-uppercase text-muted mb-3">
                                    <i class="fas fa-align-left mr-2"></i>Description
                                </h6>
                                <p class="mb-0">${product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const popup = $('<div>').dxPopup({
            title: `Product Details - ${product.name}`,
            showTitle: true,
            width: '90%',
            maxWidth: '1200px',
            height: '90%',
            contentTemplate: () => content,
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Close',
                    onClick: function(e) {
                        popup.hide();
                    }
                }
            }]
        }).dxPopup('instance');

        popup.show();
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.productPageInstance) {
    window.productPageInstance = new window.ProductPage();
} 