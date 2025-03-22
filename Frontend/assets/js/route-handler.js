function initializeRoutes(menus) {
    // Handle click events on menu items
    $(document).on('click', '.nav-link[href]', function(e) {
        e.preventDefault();
        const path = $(this).attr('href');
        handleRoute(path);
    });

    // Handle browser back/forward buttons
    window.onpopstate = function(event) {
        handleRoute(window.location.pathname, false);
    };
}

function handleRoute(path, addToHistory = true) {
    // Clean up path
    path = path.replace(/^\/+|\/+$/g, '');
    if (!path) path = '/';
    
    // Update URL
    if (addToHistory) {
        window.history.pushState({}, '', path);
    }

    // Load content
    contentLoader.loadContent(path);
}