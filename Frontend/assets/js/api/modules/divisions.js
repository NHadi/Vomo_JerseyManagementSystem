import { config } from '../config.js';
import { getAuthHeaders } from '../utils/headers.js';

export const divisionAPI = {
    async getDivisions() {
        try {
            const response = await fetch(`${config.baseUrl}/divisions`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch divisions');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get divisions error:', error);
            throw error;
        }
    },

    async createDivision(divisionData) {
        try {
            const response = await fetch(`${config.baseUrl}/divisions`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: divisionData.name,
                    description: divisionData.description,
                    tenant_id: divisionData.tenant_id
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create division');
            }

            return await response.json();
        } catch (error) {
            console.error('Create division error:', error);
            throw error;
        }
    },

    async updateDivision(divisionId, divisionData) {
        try {
            const response = await fetch(`${config.baseUrl}/divisions/${divisionId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: divisionData.name,
                    description: divisionData.description,
                    tenant_id: divisionData.tenant_id
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update division');
            }

            return await response.json();
        } catch (error) {
            console.error('Update division error:', error);
            throw error;
        }
    },

    async deleteDivision(divisionId) {
        try {
            const response = await fetch(`${config.baseUrl}/divisions/${divisionId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete division');
            }

            return true;
        } catch (error) {
            console.error('Delete division error:', error);
            throw error;
        }
    },

    async assignEmployees(divisionId, employeeIds) {
        try {
            const response = await fetch(`${config.baseUrl}/divisions/${divisionId}/employees`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ employee_ids: employeeIds })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to assign employees to division');
            }

            return await response.json();
        } catch (error) {
            console.error('Assign employees error:', error);
            throw error;
        }
    },

    async removeEmployees(divisionId, employeeIds) {
        try {
            const response = await fetch(`${config.baseUrl}/divisions/${divisionId}/employees`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ employee_ids: employeeIds })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to remove employees from division');
            }

            return true;
        } catch (error) {
            console.error('Remove employees error:', error);
            throw error;
        }
    }
}; 