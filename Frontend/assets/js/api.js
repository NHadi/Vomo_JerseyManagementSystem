// API client for Vomo backend
(function() {
    // Get API URL from window object or use default
    function getApiUrl() {
        return window.API_URL || 'http://localhost:8080/api';
    }

    // Authentication
    async function login(email, password) {
        try {
            const response = await fetch(`${getApiUrl()}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }
            
            const data = await response.json();
            // Store token
            localStorage.setItem('token', data.token);
            
            // Extract tenant_id from JWT token
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            console.log(tokenPayload);
            localStorage.setItem('tenant_id', tokenPayload.tenant_id);
            
            // Store user and menu data
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('menus', JSON.stringify(data.menus || []));
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Get headers for authenticated requests
    function getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': localStorage.getItem('tenant_id')
        };
    }

    // Menus
    async function getMenusByRole(roleId) {
        try {
            const response = await fetch(`${getApiUrl()}/menus/by-role?role_id=${roleId}`, {
                headers: getHeaders()
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch menus');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get menus error:', error);
            throw error;
        }
    }

    // Users
    async function getUsers(page = 1, size = 10) {
        try {
            const response = await fetch(`${getApiUrl()}/users?page=${page}&size=${size}`, {
                headers: getHeaders()
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch users');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    }

    async function createUser(userData) {
        try {
            const response = await fetch(`${getApiUrl()}/users`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create user');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('menus');
        localStorage.removeItem('tenant_id');
        window.location.href = '/login.html';
    }

    // Export the API functions
    window.vomoAPI = {
        login,
        getUsers,
        createUser,
        getMenusByRole,
        logout
    };
})();