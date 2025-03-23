// API Configuration
export const getApiUrl = () => window.API_URL || 'http://localhost:8080/api';

export const config = {
    baseUrl: getApiUrl(),
    defaultHeaders: {
        'Content-Type': 'application/json'
    }
}; 