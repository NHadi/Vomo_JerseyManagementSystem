const config = {
    development: {
        apiUrl: process.env.API_URL || 'http://localhost:8080/api'
    },
    production: {
        apiUrl: process.env.API_URL || 'https://api.vomo.com/api'
    }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env]; 