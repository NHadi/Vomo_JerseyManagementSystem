import { vomoAPI } from '../api/index.js';
import { getBaseUrl } from '../api/config.js';

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
        // Load categories first and wait for them to be loaded
        this.loadCategories().then(() => {
            // Initialize grid after categories are loaded
            this.initializeGrid();
            // Load data after grid is initialized
            this.loadData();
        }).catch(error => {
            console.error('Failed to initialize categories:', error);
            DevExpress.ui.notify('Failed to load categories. Please refresh the page.', 'error', 5000);
        });
    }

    async loadCategories(productId) {
        try {
            const categories = await vomoAPI.getCategories();
            console.log('Categories loaded:', categories);
            this.allCategories = categories;
            return categories;
        } catch (error) {
            console.error('Error loading categories:', error);
            DevExpress.ui.notify('Failed to load categories', 'error', 3000);
            throw error;
        }
    }

    initializeGrid() {
        const gridElement = $('#productGrid');
        if (!gridElement.length) {
            console.error('Product grid element not found');
            return;
        }

        if (this.grid) {
            this.grid.dispose();
        }

        // Create a simple array for the category lookup
        const categoryLookup = this.allCategories.map(cat => ({
            id: cat.id,
            name: cat.name
        }));

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
                        const $container = $('<div>')
                            .addClass('d-flex align-items-center');

                        // Add product image thumbnail if available
                        if (options.data.images && options.data.images.length > 0) {
                            const image = options.data.images[0];
                            const imageUrl = image.url || image.image_url;
                            const fullImageUrl = imageUrl.startsWith('http') || imageUrl.startsWith(getBaseUrl())
                                ? imageUrl
                                : `${getBaseUrl()}${imageUrl}`;

                            $('<div>')
                                .addClass('product-thumbnail mr-3')
                                .append(
                                    $('<img>')
                                        .attr('src', fullImageUrl)
                                        .attr('alt', options.data.name)
                                        .addClass('img-fluid rounded')
                                )
                                .appendTo($container);
                        } else {
                            $('<div>')
                                .addClass('product-thumbnail mr-3')
                                .append(
                                    $('<div>')
                                        .addClass('no-image-placeholder')
                                        .append($('<i>').addClass('fas fa-tshirt'))
                                )
                                .appendTo($container);
                        }

                        $('<div>')
                            .addClass('d-flex flex-column')
                            .append(
                                $('<span>').addClass('font-weight-bold').text(options.data.name || '')
                            )
                            .append(
                                $('<small>').addClass('text-muted').text(options.data.code || '')
                            )
                            .appendTo($container);

                        container.append($container);
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
                    buttons: [{
                        name: 'view',
                        hint: 'View Details',
                        icon: 'fas fa-eye',
                        onClick: (e) => {
                            this.showProductDetails(e.row.data);
                        }
                    }, {
                        name: 'edit',
                        hint: 'Edit Product',
                        icon: 'fas fa-edit'
                    }, {
                        name: 'delete',
                        hint: 'Delete Product',
                        icon: 'fas fa-trash'
                    }]
                }
            ],
            showBorders: true,
            filterRow: { visible: true },
            searchPanel: { visible: true },
            headerFilter: { visible: true },
            groupPanel: { visible: false },
            columnChooser: { enabled: false },
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
                    width: '90vw',
                    height: '90vh',
                    maxHeight: '90vh',
                    showCloseButton: true,
                    position: { my: 'center', at: 'center', of: window }
                },
                form: {
                    labelLocation: 'top',
                    showColonAfterLabel: false,
                    colCount: 2,
                    items: [
                        {
                            itemType: 'group',
                            caption: 'Product Images',
                            colSpan: 2,
                            cssClass: 'product-images-section',
                            items: [{
                                dataField: 'images',
                                label: { visible: false },
                                template: (data, itemElement) => {
                                    const $container = $('<div>').addClass('product-images-container');
                                    
                                    // Dropzone area
                                    const $dropzone = $('<div>')
                                        .addClass('dropzone-area')
                                        .append(
                                            $('<div>').addClass('dropzone-content')
                                                .append($('<i>').addClass('fas fa-cloud-upload-alt fa-3x mb-3'))
                                                .append($('<h4>').addClass('mb-2').text('Drag and drop images here'))
                                                .append($('<p>').addClass('text-muted').text('or click to browse'))
                                        )
                                        .on('dragover', (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            $dropzone.addClass('dragover');
                                        })
                                        .on('dragleave', (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            $dropzone.removeClass('dragover');
                                        })
                                        .on('drop', (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            $dropzone.removeClass('dragover');
                                            const files = e.originalEvent.dataTransfer.files;
                                            this.handleImageUpload({ target: { files } }, data, $previewContainer);
                                        })
                                        .appendTo($container);

                                    // Hidden file input
                                    const $fileInput = $('<input>')
                                        .attr('type', 'file')
                                        .attr('multiple', true)
                                        .attr('accept', 'image/*')
                                        .addClass('d-none')
                                        .on('change', (e) => this.handleImageUpload(e, data, $previewContainer))
                                        .appendTo($container);

                                    // Click anywhere in dropzone to trigger file input
                                    $dropzone.on('click', () => $fileInput.click());

                                    // Image preview container
                                    const $previewContainer = $('<div>')
                                        .addClass('image-preview-container')
                                        .appendTo($container);

                                    // Display existing images if any
                                    if (data.editorOptions.value) {
                                        this.displayProductImages(data.editorOptions.value, $previewContainer);
                                    }

                                    itemElement.append($container);
                                }
                            }]
                        },
                        {
                            itemType: 'group',
                            caption: 'Basic Information',
                            colSpan: 1,
                            cssClass: 'form-section',
                            items: [
                                {
                                    dataField: 'name',
                                    label: { text: 'Product Name' },
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter product name'
                                    },
                                    validationRules: [{ type: 'required', message: 'Product name is required' }]
                                },
                                {
                                    dataField: 'code',
                                    label: { text: 'Product Code' },
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter product code'
                                    },
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
                                        placeholder: 'Select a category',
                                        searchEnabled: true,
                                        showClearButton: true,
                                        onValueChanged: (e) => {
                                            console.log('Category selected:', e.value);
                                            if (e.value) {
                                                const selectedCategory = this.allCategories.find(c => c.id === e.value);
                                                if (selectedCategory) {
                                                    // Get the form instance directly
                                                    const form = e.component._form;
                                                    if (form) {
                                                        // Update the form data
                                                        const formData = form.option('formData') || {};
                                                        formData.category_id = selectedCategory.id;
                                                        formData.category = selectedCategory;
                                                        
                                                        // Update the form
                                                        form.updateData('category_id', selectedCategory.id);
                                                        form.updateData('category', selectedCategory);
                                                        
                                                        // Update the grid's editing data
                                                        const editRowKey = this.grid.option('editing.editRowKey');
                                                        if (editRowKey !== undefined) {
                                                            const editData = this.grid.option('editing.changes')[0]?.data || {};
                                                            editData.category_id = selectedCategory.id;
                                                            editData.category = selectedCategory;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    validationRules: [{ type: 'required', message: 'Category is required' }]
                                },
                                {
                                    dataField: 'description',
                                    label: { text: 'Description' },
                                    editorType: 'dxTextArea',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        height: 120,
                                        placeholder: 'Enter product description'
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Pricing & Production',
                            colSpan: 1,
                            cssClass: 'form-section',
                            items: [
                                {
                                    dataField: 'base_price',
                                    label: { text: 'Base Price' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        format: { type: 'currency', precision: 2 },
                                        placeholder: 'Enter base price',
                                        min: 0,
                                        step: 0.01
                                    },
                                    validationRules: [{ type: 'required', message: 'Base price is required' }]
                                },
                                {
                                    dataField: 'production_time',
                                    label: { text: 'Production Time (days)' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        min: 1,
                                        step: 1,
                                        placeholder: 'Production time'
                                    },
                                    validationRules: [{ type: 'required', message: 'Production time is required' }]
                                },
                                {
                                    dataField: 'min_order_quantity',
                                    label: { text: 'Minimum Order Quantity' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        min: 1,
                                        step: 1,
                                        placeholder: 'Minimum order quantity'
                                    },
                                    validationRules: [{ type: 'required', message: 'Minimum order quantity is required' }]
                                },
                                {
                                    dataField: 'stock_status',
                                    label: { text: 'Stock Status' },
                                    editorType: 'dxSelectBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        items: [
                                            { id: 'in_stock', text: 'In Stock' },
                                            { id: 'out_of_stock', text: 'Out of Stock' },
                                            { id: 'pre_order', text: 'Pre-Order' }
                                        ],
                                        displayExpr: 'text',
                                        valueExpr: 'id',
                                        placeholder: 'Select status'
                                    },
                                    validationRules: [{ type: 'required', message: 'Stock status is required' }]
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Bulk Discount Rules',
                            colSpan: 2,
                            cssClass: 'form-section',
                            items: [
                                {
                                    dataField: 'bulk_discount_rules.10',
                                    label: { text: 'Discount for ≥10 units (%)' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        suffix: '%',
                                        placeholder: 'Enter discount percentage'
                                    }
                                },
                                {
                                    dataField: 'bulk_discount_rules.20',
                                    label: { text: 'Discount for ≥20 units (%)' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        suffix: '%',
                                        placeholder: 'Enter discount percentage'
                                    }
                                },
                                {
                                    dataField: 'bulk_discount_rules.50',
                                    label: { text: 'Discount for ≥50 units (%)' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        suffix: '%',
                                        placeholder: 'Enter discount percentage'
                                    }
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Product Details',
                            colSpan: 2,
                            cssClass: 'form-section',
                            items: [
                                {
                                    dataField: 'material',
                                    label: { text: 'Material' },
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        placeholder: 'Enter material type'
                                    },
                                    validationRules: [{ type: 'required', message: 'Material is required' }]
                                },
                                {
                                    dataField: 'weight',
                                    label: { text: 'Weight (g)' },
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        min: 0,
                                        step: 1,
                                        placeholder: 'Enter weight in grams'
                                    },
                                    validationRules: [{ type: 'required', message: 'Weight is required' }]
                                },
                                {
                                    dataField: 'size_available',
                                    label: { text: 'Available Sizes' },
                                    editorType: 'dxTagBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        items: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
                                        showSelectionControls: true,
                                        placeholder: 'Select available sizes',
                                        multiline: false
                                    },
                                    validationRules: [{ type: 'required', message: 'At least one size must be selected' }]
                                },
                                {
                                    dataField: 'color_options',
                                    label: { text: 'Color Options' },
                                    editorType: 'dxTagBox',
                                    editorOptions: {
                                        stylingMode: 'filled',
                                        items: ['Red/White', 'Blue/White', 'Green/White', 'Black/White', 'Custom'],
                                        showSelectionControls: true,
                                        placeholder: 'Select available colors',
                                        multiline: false
                                    },
                                    validationRules: [{ type: 'required', message: 'At least one color must be selected' }]
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'Customization Options',
                            colSpan: 2,
                            cssClass: 'form-section',
                            items: [
                                {
                                    dataField: 'customization_options.name',
                                    label: { text: 'Name Customization' },
                                    editorType: 'dxSwitch',
                                    editorOptions: {
                                        switchedOnText: 'YES',
                                        switchedOffText: 'NO'
                                    }
                                },
                                {
                                    dataField: 'customization_options.number',
                                    label: { text: 'Number Customization' },
                                    editorType: 'dxSwitch',
                                    editorOptions: {
                                        switchedOnText: 'YES',
                                        switchedOffText: 'NO'
                                    }
                                },
                                {
                                    dataField: 'customization_options.patches',
                                    label: { text: 'Patches Available' },
                                    editorType: 'dxSwitch',
                                    editorOptions: {
                                        switchedOnText: 'YES',
                                        switchedOffText: 'NO'
                                    }
                                },
                                {
                                    dataField: 'customization_options.team_logo',
                                    label: { text: 'Team Logo Available' },
                                    editorType: 'dxSwitch',
                                    editorOptions: {
                                        switchedOnText: 'YES',
                                        switchedOffText: 'NO'
                                    }
                                }
                            ]
                        }
                    ]
                },
                startEditAction: 'click',
                refreshMode: 'reshape'
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
            onInitialized: (e) => {
                this.grid = e.component;
                console.log('Grid initialized');
            },
            onEditingStart: (e) => {
                console.log('Edit starting for row:', e.key);
                console.log('Row data:', e.data);
                
                // Wait for the popup to be shown and form to be created
                setTimeout(() => {
                    // Get the existing data
                    const formData = { ...e.data };  // Create a copy of existing data
                    console.log('Original data when editing starts:', formData);

                    // Get the form instance
                    const form = $('.dx-popup-content .dx-form').dxForm('instance');
                    if (!form) {
                        console.error('Form instance not found');
                        return;
                    }

                    // Initialize arrays with existing values or empty arrays
                    formData.size_available = Array.isArray(formData.size_available) ? formData.size_available : [];
                    formData.color_options = Array.isArray(formData.color_options) ? formData.color_options : [];
                    formData.images = Array.isArray(formData.images) ? formData.images : [];
                    
                    // Initialize customization options while preserving existing values
                    formData.customization_options = {
                        name: Boolean(formData.customization_options?.name),
                        number: Boolean(formData.customization_options?.number),
                        patches: Boolean(formData.customization_options?.patches),
                        team_logo: Boolean(formData.customization_options?.team_logo)
                    };
                    
                    // Initialize bulk discount rules while preserving existing values
                    formData.bulk_discount_rules = {
                        10: parseInt(formData.bulk_discount_rules?.['10']) || 0,
                        20: parseInt(formData.bulk_discount_rules?.['20']) || 0,
                        50: parseInt(formData.bulk_discount_rules?.['50']) || 0
                    };
                    
                    // Ensure category is properly set
                    if (formData.category_id) {
                        formData.category_id = parseInt(formData.category_id);
                        const category = this.allCategories.find(c => c.id === formData.category_id);
                        if (category) {
                            formData.category = category;
                        }
                    }

                    // Set the entire form data first
                    form.option('formData', formData);

                    // Then update each field individually to ensure proper binding
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value !== undefined) {
                            form.updateData(key, value);
                        }
                    });

                    // Update nested fields
                    if (formData.customization_options) {
                        Object.entries(formData.customization_options).forEach(([key, value]) => {
                            form.updateData(`customization_options.${key}`, value);
                        });
                    }

                    if (formData.bulk_discount_rules) {
                        Object.entries(formData.bulk_discount_rules).forEach(([key, value]) => {
                            form.updateData(`bulk_discount_rules.${key}`, value);
                        });
                    }

                    // Update specific fields that might need type conversion
                    form.updateData('base_price', parseFloat(formData.base_price) || 0);
                    form.updateData('production_time', parseInt(formData.production_time) || 1);
                    form.updateData('min_order_quantity', parseInt(formData.min_order_quantity) || 1);
                    form.updateData('weight', parseInt(formData.weight) || 100);
                    form.updateData('is_active', Boolean(formData.is_active));
                    form.updateData('stock_status', formData.stock_status || 'in_stock');
                    form.updateData('material', formData.material || 'Default Material');
                    form.updateData('description', formData.description || '');
                    form.updateData('code', formData.code || `PROD-${Date.now()}`);

                    // Force form to update UI
                    form.repaint();

                    // Log the final state
                    console.log('Final form data after initialization:', form.option('formData'));
                }, 100);
            },
            onRowUpdating: (e) => {
                console.log('Row updating:', e);
            }
        }).dxDataGrid('instance');

        // Add enhanced CSS for professional styling
        $('<style>')
            .text(`
                /* Grid Styling */
                .dx-datagrid {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
                }

                .dx-datagrid-headers {
                    background: #f8f9fa;
                    border-bottom: 2px solid #e9ecef;
                }

                .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
                    padding: 16px;
                    font-weight: 600;
                    color: #344767;
                    background: transparent;
                }

                .dx-datagrid-rowsview .dx-row {
                    border-bottom: 1px solid #f0f2f5;
                }

                .dx-datagrid-rowsview .dx-row:hover {
                    background-color: #f8f9fa;
                }

                .dx-datagrid-rowsview .dx-row > td {
                    padding: 16px;
                    vertical-align: middle;
                }

                /* Product Form Styling */
                .dx-popup-content {
                    padding: 0 !important;
                }

                .dx-popup-title {
                    background: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                    padding: 20px 24px;
                }

                .dx-popup-title .dx-toolbar-items-container {
                    height: auto;
                }

                .dx-popup-title .dx-toolbar-label {
                    font-size: 18px;
                    font-weight: 600;
                    color: #344767;
                }

                .dx-form {
                    padding: 24px;
                }

                .dx-form-group-caption {
                    font-size: 14px;
                    font-weight: 600;
                    color: #344767;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 0 0 16px;
                }

                .dx-form-group {
                    padding: 24px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                    margin-bottom: 24px;
                }

                .dx-form .dx-texteditor {
                    border-radius: 6px;
                }

                .dx-form .dx-texteditor.dx-state-focused {
                    border-color: #5e72e4;
                    box-shadow: 0 0 0 3px rgba(94,114,228,0.1);
                }

                .dx-form .dx-texteditor-input {
                    padding: 8px 12px;
                    font-size: 14px;
                }

                /* Image Upload Section */
                .product-images-container {
                    padding: 24px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 2px dashed #e9ecef;
                    transition: all 0.3s ease;
                }

                .product-images-container:hover {
                    border-color: #5e72e4;
                    background: #f8f9fa;
                }

                .upload-button-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 24px;
                    text-align: center;
                }

                .upload-button-container .btn {
                    padding: 12px 24px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                }

                .upload-button-container .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(94,114,228,0.15);
                }

                .image-preview-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 16px;
                    padding: 16px;
                }

                .image-preview {
                    position: relative;
                    padding-top: 100%;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }

                .image-preview.uploading::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }

                .image-preview.uploading::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                    border: 4px solid #fff;
                    border-top-color: transparent;
                    border-radius: 50%;
                    z-index: 1;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }

                .image-preview img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-preview .delete-button {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(255,255,255,0.9);
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #dc3545;
                    transition: all 0.2s;
                    opacity: 0;
                    transform: translateY(-8px);
                }

                .image-preview:hover .delete-button {
                    opacity: 1;
                    transform: translateY(0);
                }

                .image-preview .delete-button:hover {
                    background: #dc3545;
                    color: white;
                }

                /* Product Grid Thumbnails */
                .product-thumbnail {
                    width: 64px;
                    height: 64px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
                }

                .product-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .no-image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f9fa;
                    color: #adb5bd;
                    font-size: 24px;
                }

                /* Status Badges */
                .badge {
                    padding: 6px 12px;
                    font-weight: 600;
                    font-size: 12px;
                    border-radius: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .badge-soft-primary {
                    background: rgba(94,114,228,0.1);
                    color: #5e72e4;
                }

                .badge-soft-success {
                    background: rgba(45,206,137,0.1);
                    color: #2dce89;
                }

                .badge-soft-info {
                    background: rgba(17,205,239,0.1);
                    color: #11cdef;
                }

                /* Form Controls */
                .dx-switch {
                    height: 24px;
                }

                .dx-switch.dx-state-hover {
                    border-color: #5e72e4;
                }

                .dx-switch.dx-state-focused {
                    box-shadow: 0 0 0 3px rgba(94,114,228,0.1);
                }

                .dx-selectbox {
                    border-radius: 6px;
                }

                .dx-selectbox.dx-state-focused {
                    border-color: #5e72e4;
                    box-shadow: 0 0 0 3px rgba(94,114,228,0.1);
                }

                /* Action Buttons */
                .dx-button {
                    border-radius: 6px;
                    min-height: 38px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .dx-button-has-text .dx-button-content {
                    padding: 8px 16px;
                }

                .dx-button-success {
                    background: #2dce89;
                    color: white;
                }

                .dx-button-success:hover {
                    background: #26af74;
                }

                /* Popup Footer */
                .dx-popup-bottom {
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                    padding: 16px 24px;
                }

                .dx-popup-bottom .dx-toolbar-items-container {
                    height: auto;
                }

                /* Form Popup Styling */
                .dx-popup-wrapper .dx-popup-content {
                    padding: 0;
                    overflow-y: auto;
                }

                .dx-popup-title {
                    background: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                    padding: 28px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }

                .dx-popup-title .dx-toolbar-label {
                    font-size: 28px;
                    font-weight: 600;
                    color: #344767;
                }

                /* Form Layout */
                .dx-form {
                    padding: 40px;
                    max-width: 100%;
                    margin: 0 auto;
                }

                .form-section {
                    background: white;
                    border-radius: 16px;
                    margin-bottom: 40px;
                    padding: 40px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    height: 100%;
                }

                .form-section .dx-form-group-caption {
                    font-size: 20px;
                    font-weight: 600;
                    color: #344767;
                    margin-bottom: 32px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* Form Fields */
                .dx-field-item {
                    margin-bottom: 24px;
                }

                .dx-field-item-label {
                    font-size: 15px;
                    font-weight: 500;
                    color: #344767;
                    margin-bottom: 10px;
                }

                .dx-texteditor {
                    border-radius: 12px;
                    background: #f8f9fa;
                    height: 56px;
                }

                .dx-texteditor.dx-editor-filled {
                    background: #f8f9fa;
                }

                .dx-texteditor.dx-state-focused {
                    border-color: #5e72e4;
                    box-shadow: 0 0 0 3px rgba(94,114,228,0.1);
                }

                .dx-texteditor-input {
                    font-size: 16px;
                    padding: 16px 20px;
                    min-height: 56px;
                }

                .dx-textarea {
                    height: auto;
                }

                .dx-textarea .dx-texteditor-input {
                    min-height: 140px;
                    padding: 20px;
                }

                /* Image Upload Area */
                .dropzone-area {
                    background: #f8f9fa;
                    border: 3px dashed #e9ecef;
                    border-radius: 16px;
                    padding: 60px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    margin-bottom: 32px;
                }

                .dropzone-area.dragover {
                    background: #fff;
                    border-color: #5e72e4;
                    transform: scale(1.02);
                }

                .dropzone-content i {
                    color: #5e72e4;
                    margin-bottom: 24px;
                    font-size: 64px;
                }

                .dropzone-content h4 {
                    color: #344767;
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .dropzone-content p {
                    font-size: 16px;
                    color: #8898aa;
                }

                /* Image Preview Grid */
                .image-preview-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 32px;
                    padding: 32px;
                }

                .image-preview {
                    position: relative;
                    padding-top: 100%;
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }

                .image-preview:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
                }

                /* Form Buttons */
                .dx-popup-bottom {
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                    padding: 28px 40px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                .product-gallery-item:hover {
                    transform: scale(1.02);
                }
                
                .product-gallery-item img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            `)
            .appendTo('head');
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
            // Get the form instance
            const $form = $('.dx-popup-content .dx-form');
            const form = $form.length ? $form.dxForm('instance') : null;
            
            if (!form) {
                throw new Error('Form instance not found');
            }

            // Get all form data
            const formData = form.option('formData') || {};
            console.log('Form data before processing:', formData);

            // Get the grid's editing data
            const gridData = e.data || {};
            console.log('Grid data:', gridData);

            // Merge form data with grid data, giving priority to form data
            const cleanData = { ...gridData, ...formData };
            console.log('Merged data:', cleanData);

            // Remove any temporary fields
            delete cleanData.__KEY__;
            delete cleanData.pendingImages;

            // Initialize arrays if they don't exist
            cleanData.size_available = Array.isArray(cleanData.size_available) ? cleanData.size_available : [];
            cleanData.color_options = Array.isArray(cleanData.color_options) ? cleanData.color_options : [];
            cleanData.images = Array.isArray(cleanData.images) ? cleanData.images : [];

            // Initialize customization options
            cleanData.customization_options = {
                name: Boolean(cleanData.customization_options?.name),
                number: Boolean(cleanData.customization_options?.number),
                patches: Boolean(cleanData.customization_options?.patches),
                team_logo: Boolean(cleanData.customization_options?.team_logo),
                ...cleanData.customization_options
            };

            // Initialize bulk discount rules
            cleanData.bulk_discount_rules = {
                10: parseInt(cleanData.bulk_discount_rules?.['10']) || 0,
                20: parseInt(cleanData.bulk_discount_rules?.['20']) || 0,
                50: parseInt(cleanData.bulk_discount_rules?.['50']) || 0,
                ...cleanData.bulk_discount_rules
            };

            // Set default values for missing fields
            cleanData.code = cleanData.code || `PROD-${Date.now()}`;
            cleanData.material = cleanData.material || 'Default Material';
            cleanData.description = cleanData.description || '';
            cleanData.weight = parseInt(cleanData.weight) || 100;
            cleanData.min_order_quantity = parseInt(cleanData.min_order_quantity) || 1;
            cleanData.is_active = cleanData.is_active !== undefined ? Boolean(cleanData.is_active) : true;
            cleanData.stock_status = cleanData.stock_status || 'in_stock';

            // Ensure numeric fields are properly formatted
            cleanData.base_price = parseFloat(cleanData.base_price) || 0;
            cleanData.production_time = parseInt(cleanData.production_time) || 1;
            cleanData.min_order_quantity = parseInt(cleanData.min_order_quantity) || 1;
            cleanData.weight = parseInt(cleanData.weight) || 100;

            // Handle category_id and category object
            if (cleanData.category_id) {
                cleanData.category_id = parseInt(cleanData.category_id);
                const category = this.allCategories.find(c => c.id === cleanData.category_id);
                if (category) {
                    cleanData.category = category;
                } else {
                    throw new Error('Invalid category selected');
                }
            } else {
                throw new Error('Category is required');
            }

            // Validate required fields
            const requiredFields = {
                name: { value: cleanData.name, message: 'Product name is required' },
                category_id: { value: cleanData.category_id, message: 'Category is required' },
                base_price: { value: parseFloat(cleanData.base_price), message: 'Base price is required' },
                production_time: { value: parseInt(cleanData.production_time), message: 'Production time is required' },
                size_available: { value: cleanData.size_available?.length > 0, message: 'At least one size must be selected' }
            };

            // Check each required field
            for (const [field, { value, message }] of Object.entries(requiredFields)) {
                if (!value && value !== 0) {
                    console.error(`Missing required field: ${field}`, cleanData);
                    throw new Error(message);
                }
            }

            console.log('Final data being sent to API:', cleanData);

            // Create the product
            const result = await vomoAPI.createProduct(cleanData);
            e.data.id = result.id;

            // Handle image uploads if any
            if (e.data.pendingImages && e.data.pendingImages.length > 0) {
                for (const file of e.data.pendingImages) {
                    try {
                        const uploadedImage = await vomoAPI.uploadProductImage(result.id, file);
                        if (!e.data.images) {
                            e.data.images = [];
                        }
                        e.data.images.push(uploadedImage);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        DevExpress.ui.notify(`Failed to upload image: ${file.name}`, 'error', 3000);
                    }
                }
                delete e.data.pendingImages;
            }

            DevExpress.ui.notify('Product created successfully', 'success', 3000);
        } catch (error) {
            console.error('Error creating product:', error);
            e.cancel = true;
            DevExpress.ui.notify('Error creating product: ' + error.message, 'error', 3000);
        }
    }

    async handleRowUpdating(e) {
        try {
            // Get the form instance
            const $form = $('.dx-popup-content .dx-form');
            const form = $form.length ? $form.dxForm('instance') : null;
            
            if (!form) {
                throw new Error('Form instance not found');
            }

            // Get all form data
            const formData = form.option('formData') || {};
            console.log('Form data before processing:', formData);

            // Get the grid's editing data
            const gridData = e.newData || {};
            console.log('Grid data:', gridData);

            // Merge form data with grid data, giving priority to form data
            const cleanData = { ...e.oldData, ...gridData, ...formData };
            console.log('Merged data:', cleanData);

            // Remove any temporary fields
            delete cleanData.__KEY__;
            delete cleanData.pendingImages;

            // Initialize arrays if they don't exist
            cleanData.size_available = Array.isArray(cleanData.size_available) ? cleanData.size_available : [];
            cleanData.color_options = Array.isArray(cleanData.color_options) ? cleanData.color_options : [];
            cleanData.images = Array.isArray(cleanData.images) ? cleanData.images : [];

            // Initialize customization options
            cleanData.customization_options = {
                name: Boolean(cleanData.customization_options?.name),
                number: Boolean(cleanData.customization_options?.number),
                patches: Boolean(cleanData.customization_options?.patches),
                team_logo: Boolean(cleanData.customization_options?.team_logo),
                ...cleanData.customization_options
            };

            // Initialize bulk discount rules
            cleanData.bulk_discount_rules = {
                10: parseInt(cleanData.bulk_discount_rules?.['10']) || 0,
                20: parseInt(cleanData.bulk_discount_rules?.['20']) || 0,
                50: parseInt(cleanData.bulk_discount_rules?.['50']) || 0,
                ...cleanData.bulk_discount_rules
            };

            // Set default values for missing fields
            cleanData.code = cleanData.code || `PROD-${Date.now()}`;
            cleanData.material = cleanData.material || 'Default Material';
            cleanData.description = cleanData.description || '';
            cleanData.weight = parseInt(cleanData.weight) || 100;
            cleanData.min_order_quantity = parseInt(cleanData.min_order_quantity) || 1;
            cleanData.is_active = cleanData.is_active !== undefined ? Boolean(cleanData.is_active) : true;
            cleanData.stock_status = cleanData.stock_status || 'in_stock';

            // Ensure numeric fields are properly formatted
            cleanData.base_price = parseFloat(cleanData.base_price) || 0;
            cleanData.production_time = parseInt(cleanData.production_time) || 1;
            cleanData.min_order_quantity = parseInt(cleanData.min_order_quantity) || 1;
            cleanData.weight = parseInt(cleanData.weight) || 100;

            // Handle category_id and category object
            if (cleanData.category_id) {
                cleanData.category_id = parseInt(cleanData.category_id);
                const category = this.allCategories.find(c => c.id === cleanData.category_id);
                if (category) {
                    cleanData.category = category;
                } else {
                    throw new Error('Invalid category selected');
                }
            } else {
                throw new Error('Category is required');
            }

            // Validate required fields
            const requiredFields = {
                name: { value: cleanData.name, message: 'Product name is required' },
                category_id: { value: cleanData.category_id, message: 'Category is required' },
                base_price: { value: parseFloat(cleanData.base_price), message: 'Base price is required' },
                production_time: { value: parseInt(cleanData.production_time), message: 'Production time is required' },
                size_available: { value: cleanData.size_available?.length > 0, message: 'At least one size must be selected' }
            };

            // Check each required field
            for (const [field, { value, message }] of Object.entries(requiredFields)) {
                if (!value && value !== 0) {
                    console.error(`Missing required field: ${field}`, cleanData);
                    throw new Error(message);
                }
            }

            console.log('Final data being sent to API:', cleanData);

            // Update the product
            await vomoAPI.updateProduct(e.key.id, cleanData);

            // Handle image uploads if any
            if (e.data.pendingImages && e.data.pendingImages.length > 0) {
                for (const file of e.data.pendingImages) {
                    try {
                        const uploadedImage = await vomoAPI.uploadProductImage(e.key.id, file);
                        if (!cleanData.images) {
                            cleanData.images = [];
                        }
                        cleanData.images.push(uploadedImage);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        DevExpress.ui.notify(`Failed to upload image: ${file.name}`, 'error', 3000);
                    }
                }
                delete e.data.pendingImages;
            }

            DevExpress.ui.notify('Product updated successfully', 'success', 3000);
        } catch (error) {
            console.error('Error updating product:', error);
            e.cancel = true;
            DevExpress.ui.notify('Error updating product: ' + error.message, 'error', 3000);
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

    async handleImageUpload(event, data, previewContainer) {
        const files = Array.from(event.target.files || event.originalEvent?.dataTransfer?.files || []);
        console.log('Files to upload:', files);
        
        const maxSize = 5 * 1024 * 1024; // 5MB limit
        
        // Get product ID from the form data
        const formData = data.component.option('formData');
        const productId = formData && formData.id;
        
        console.log('Product ID:', productId);
        
        // For new products, we'll store the files temporarily
        if (!productId) {
            if (!formData.pendingImages) {
                formData.pendingImages = [];
            }
            
            for (const file of files) {
                if (file.size > maxSize) {
                    DevExpress.ui.notify(`File ${file.name} exceeds 5MB limit`, 'error', 3000);
                    continue;
                }

                console.log('Adding pending file:', file);
                // Store file and show preview
                const tempPreview = this.createImagePreview(URL.createObjectURL(file));
                previewContainer.append(tempPreview);
                formData.pendingImages.push(file);
            }
            
            // Update form data with pending images
            data.component.option('formData', formData);
            return;
        }
        
        // For existing products, upload immediately
        for (const file of files) {
            if (file.size > maxSize) {
                DevExpress.ui.notify(`File ${file.name} exceeds 5MB limit`, 'error', 3000);
                continue;
            }

            try {
                console.log('Uploading file:', file);
                
                // Show loading preview
                const tempPreview = this.createImagePreview(URL.createObjectURL(file));
                tempPreview.addClass('uploading');
                previewContainer.append(tempPreview);

                // Upload the image directly
                const uploadedImage = await vomoAPI.uploadProductImage(productId, file);
                console.log('Uploaded image response:', uploadedImage);

                // Update preview with actual image URL including base URL
                tempPreview.removeClass('uploading');
                const fullImageUrl = `${getBaseUrl()}${uploadedImage.image_url}`;
                tempPreview.find('img').attr('src', fullImageUrl);

                // Add to form data with the full URL
                if (!formData.images) {
                    formData.images = [];
                }
                formData.images.push({
                    ...uploadedImage,
                    url: fullImageUrl // Store the full URL in the form data
                });
                
                // Update the form data
                data.component.option('formData', formData);

                DevExpress.ui.notify('Image uploaded successfully', 'success', 3000);
            } catch (error) {
                console.error('Error uploading image:', error);
                DevExpress.ui.notify(`Failed to upload image: ${error.message}`, 'error', 3000);
            }
        }
    }

    createImagePreview(src) {
        // If it's a blob URL (for temporary preview), use it as is
        // Otherwise, prepend the backend base URL
        const imageUrl = src.startsWith('blob:') ? src : `${getBaseUrl()}${src}`;
        
        return $('<div>')
            .addClass('image-preview')
            .append(
                $('<img>').attr('src', imageUrl)
            )
            .append(
                $('<div>')
                    .addClass('delete-button')
                    .append($('<i>').addClass('fas fa-times'))
                    .on('click', function() {
                        $(this).closest('.image-preview').remove();
                    })
            );
    }

    displayProductImages(images, container) {
        container.empty();
        images.forEach(image => {
            // Handle both cases where the URL might be stored as image.url or image.image_url
            const imageUrl = image.url || image.image_url;
            // If the URL already starts with http or the base URL, use it as is
            const fullImageUrl = imageUrl.startsWith('http') || imageUrl.startsWith(getBaseUrl())
                ? imageUrl
                : `${getBaseUrl()}${imageUrl}`;
            
            const $preview = this.createImagePreview(fullImageUrl);
            container.append($preview);
        });
    }

    showProductDetails(product) {
        // ... existing showProductDetails code ...
    }
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.productPageInstance) {
    window.productPageInstance = new window.ProductPage();
} 