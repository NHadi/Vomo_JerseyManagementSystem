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
                                $('<span>').text(options.data.name || '')
                            )
                            .appendTo(container);
                    }
                },
                {
                    dataField: 'code',
                    caption: 'Product Code',
                    validationRules: [{ type: 'required' }]
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
                    dataField: 'base_price',
                    caption: 'Base Price',
                    dataType: 'number',
                    format: 'currency',
                    validationRules: [{ type: 'required' }]
                },
                {
                    dataField: 'stock_status',
                    caption: 'Stock Status',
                    validationRules: [{ type: 'required' }],
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

                        // Manage Category Button
                        $('<button>')
                            .addClass('btn btn-icon-only btn-sm btn-primary mr-2')
                            .attr({
                                'title': 'Manage Category',
                                'data-toggle': 'modal',
                                'data-target': '#categoryModal',
                                'data-product-id': options.row.data.id,
                                'data-product-name': options.row.data.name
                            })
                            .append($('<i>').addClass('fas fa-tag'))
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
                                    dataField: 'material',
                                    validationRules: [{ type: 'required', message: 'Material is required' }]
                                },
                                {
                                    dataField: 'production_time',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        min: 1,
                                        step: 1
                                    },
                                    validationRules: [{ type: 'required', message: 'Production time is required' }]
                                },
                                {
                                    dataField: 'min_order_quantity',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        min: 1,
                                        step: 1
                                    },
                                    validationRules: [{ type: 'required', message: 'Minimum order quantity is required' }]
                                },
                                {
                                    dataField: 'weight',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        min: 0,
                                        step: 0.1
                                    },
                                    validationRules: [{ type: 'required', message: 'Weight is required' }]
                                },
                                {
                                    dataField: 'stock_status',
                                    editorType: 'dxSelectBox',
                                    editorOptions: {
                                        items: ['in_stock', 'out_of_stock', 'pre_order'],
                                        placeholder: 'Select stock status'
                                    },
                                    validationRules: [{ type: 'required', message: 'Stock status is required' }]
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
};

// Initialize only if DevExtreme is loaded
if (typeof DevExpress !== 'undefined' && !window.productPageInstance) {
    window.productPageInstance = new window.ProductPage();
} 