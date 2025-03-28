package routes

import (
	"vomo/internal/application"
	"vomo/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupProductRoutes sets up the product routes
func SetupProductRoutes(router *gin.RouterGroup, productService *application.ProductService, categoryService *application.ProductCategoryService) {
	productGroup := router.Group("/products")
	{
		productGroup.POST("", handlers.CreateProduct(productService, categoryService))
		productGroup.GET("", handlers.GetAllProducts(productService, categoryService))
		productGroup.GET("/:id", handlers.GetProduct(productService, categoryService))
		productGroup.PUT("/:id", handlers.UpdateProduct(productService, categoryService))
		productGroup.DELETE("/:id", handlers.DeleteProduct(productService))
		productGroup.GET("/category/:category_id", handlers.GetProductsByCategory(productService, categoryService))
	}
}
