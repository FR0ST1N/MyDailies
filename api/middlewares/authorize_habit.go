package middlewares

import (
	"net/http"

	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
)

// Check if the habit id belongs to the user id
func AuthorizeHabit(repo repository.IHabitRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get auth user id from context and habit id from param
		uid, _ := c.Get("user")
		hid, hidErr := others.GetParamUint(c, "id")
		if hidErr != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON("Error parsing habit id"))
			return
		}

		// Check if habit belongs to user
		isUser, err := repo.IsUser(uid.(uint), hid)
		if err != nil {
			others.HandleGormError(c, err)
			return
		}
		if !isUser {
			c.AbortWithStatusJSON(http.StatusUnauthorized, others.GetErrJSON("Habit id does not belong to the user"))
			return
		}
		c.Set("habit", hid)
		c.Next()
	}
}
