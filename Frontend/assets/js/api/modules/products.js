import { config } from '../config.js';
import { getAuthHeaders } from '../utils/headers.js';

export const productAPI = {
    async getProducts() {
        try {
            const response = await fetch(`${config.baseUrl}/products`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch products');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get products error:', error);
            throw error;
        }
    },

    async createProduct(productData) {
        try {
            const response = await fetch(`${config.baseUrl}/products`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: productData.name,
                    code: productData.code,
                    category_id: productData.category_id,
                    description: productData.description,
                    material: productData.material,
                    size_available: productData.size_available,
                    color_options: productData.color_options,
                    customization_options: productData.customization_options,
                    production_time: productData.production_time,
                    min_order_quantity: productData.min_order_quantity,
                    base_price: productData.base_price,
                    bulk_discount_rules: productData.bulk_discount_rules,
                    weight: productData.weight,
                    is_active: productData.is_active,
                    stock_status: productData.stock_status,
                    tenant_id: productData.tenant_id
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create product');
            }

            return await response.json();
        } catch (error) {
            console.error('Create product error:', error);
            throw error;
        }
    },

    async updateProduct(productId, productData) {
        try {
            const response = await fetch(`${config.baseUrl}/products/${productId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: productData.name,
                    code: productData.code,
                    category_id: productData.category_id,
                    description: productData.description,
                    material: productData.material,
                    size_available: productData.size_available,
                    color_options: productData.color_options,
                    customization_options: productData.customization_options,
                    production_time: productData.production_time,
                    min_order_quantity: productData.min_order_quantity,
                    base_price: productData.base_price,
                    bulk_discount_rules: productData.bulk_discount_rules,
                    weight: productData.weight,
                    is_active: productData.is_active,
                    stock_status: productData.stock_status,
                    tenant_id: productData.tenant_id
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update product');
            }

            return await response.json();
        } catch (error) {
            console.error('Update product error:', error);
            throw error;
        }
    },

    async deleteProduct(productId) {
        try {
            const response = await fetch(`${config.baseUrl}/products/${productId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete product');
            }

            return true;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    }
}; 