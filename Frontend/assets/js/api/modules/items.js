import { config } from '../config.js';
import { getAuthHeaders } from '../utils/headers.js';

export const itemAPI = {
    async getItems() {
        try {
            const response = await fetch(`${config.baseUrl}/items`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch items');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get items error:', error);
            throw error;
        }
    },

    async createItem(itemData) {
        try {
            const response = await fetch(`${config.baseUrl}/items`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create item');
            }

            return await response.json();
        } catch (error) {
            console.error('Create item error:', error);
            throw error;
        }
    },

    async updateItem(itemId, itemData) {
        try {
            const response = await fetch(`${config.baseUrl}/items/${itemId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update item');
            }

            return await response.json();
        } catch (error) {
            console.error('Update item error:', error);
            throw error;
        }
    },

    async deleteItem(itemId) {
        try {
            const response = await fetch(`${config.baseUrl}/items/${itemId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete item');
            }

            return true;
        } catch (error) {
            console.error('Delete item error:', error);
            throw error;
        }
    }
}; 