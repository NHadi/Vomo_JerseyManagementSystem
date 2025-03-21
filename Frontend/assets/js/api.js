// API client for Vomo backend
const API_URL = 'http://localhost:8080/api';

// Authentication
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
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
    // Store both user and menu data in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('menus', JSON.stringify(data.menus || []));
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Menus
async function getMenusByRole(roleId) {
  try {
    const response = await fetch(`${API_URL}/menus/by-role?role_id=${roleId}`);
    
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
    const response = await fetch(`${API_URL}/users?page=${page}&size=${size}`);
    
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
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

// Export the API functions
window.vomoAPI = {
  login,
  getUsers,
  createUser,
  getMenusByRole
};