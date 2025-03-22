// Menu routes
    router.POST("/api/menus", handlers.CreateMenu(menuService))
    router.PUT("/api/menus/:id", handlers.UpdateMenu(menuService))
    router.DELETE("/api/menus/:id", handlers.DeleteMenu(menuService))
    router.GET("/api/menus/:id", handlers.GetMenu(menuService))
    router.GET("/api/menus", handlers.GetAllMenus(menuService))