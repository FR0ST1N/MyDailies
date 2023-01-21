package middlewares

import (
	"net/http"

	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/gin-gonic/gin"
)

func Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get admin var from auth middleware
		admin, _ := c.Get("admin")
		if admin == false {
			statusCode := http.StatusForbidden
			c.AbortWithStatusJSON(statusCode, others.GetErrJSON(http.StatusText(statusCode)))
			return
		}
		c.Next()
	}
}
