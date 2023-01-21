package middlewares

import (
	"net/http"
	"strings"

	"github.com/FR0ST1N/MyDailies/api/auth"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check for token string
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" || !strings.Contains(tokenString, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, others.GetErrJSON("no access token"))
			return
		}
		// Validate string
		token, err := auth.ValidateToken(strings.Split(tokenString, "Bearer ")[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, others.GetErrJSON(err.Error()))
			return
		}
		// Set user id and admin to context
		claims := token.Claims.(*auth.JWTClaim)
		c.Set("user", claims.UserID)
		c.Set("admin", claims.Admin)
		c.Next()
	}
}
