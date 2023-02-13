package others

import (
	"errors"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func TruncateToDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
}

func GetParamUint(c *gin.Context, name string) (uint, error) {
	i, err := strconv.ParseUint(c.Param(name), 10, 64)
	return uint(i), err
}

func GetQueryUint(c *gin.Context, name string) (uint, error) {
	i, err := strconv.ParseUint(c.Query(name), 10, 64)
	return uint(i), err
}

func HandleGormError(c *gin.Context, err error) {
	// ErrRecordNotFound is the most common type of error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, GetErrJSON(err.Error()))
	} else {
		c.AbortWithStatusJSON(http.StatusInternalServerError, GetErrJSON(err.Error()))
	}
}

func GetErrJSON(s string) *gin.H {
	return &gin.H{
		"error": s,
	}
}

func GetJWTSecretKey() []byte {
	s := os.Getenv("JWT_SECRET_KEY")
	if len(s) == 0 {
		s = "test"
	}
	return []byte(s)
}
