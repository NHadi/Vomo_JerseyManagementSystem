const express = require('express');
const path = require('path');
const config = require('./config');
const app = express();
const port = process.env.PORT || 8090;

// Function to inject configuration into HTML
function injectConfig(html) {
    const configScript = `
        <script>
            window.API_URL = '${config.apiUrl}';
        </script>
    `;
    return html.replace('</head>', `${configScript}</head>`);
}

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname)));

// Handle HTML files with configuration injection
app.get('*.html', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    if (!require('fs').existsSync(filePath)) {
        return res.status(404).send('File not found');
    }
    let html = require('fs').readFileSync(filePath, 'utf8');
    html = injectConfig(html);
    res.send(html);
});

// Special handling for component requests to return 404 if not found
app.get('/components/*', (req, res, next) => {
    const filePath = path.join(__dirname, req.path);
    if (!require('fs').existsSync(filePath)) {
        return res.status(404).send('Component not found');
    }
    next();
});

// Handle all other routes by serving index.html with configuration
app.get('*', (req, res) => {
    // Skip if the request is for a static file
    if (req.path.includes('.')) {
        return res.sendFile(path.join(__dirname, req.path));
    }
    // For all other routes, serve index.html with configuration
    let html = require('fs').readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    html = injectConfig(html);
    res.send(html);
});

app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
    console.log(`API URL: ${config.apiUrl}`);
}); 