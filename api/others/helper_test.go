package others_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"
	"time"

	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestTruncateToDay(t *testing.T) {
	a := assert.New(t)
	timeNow := time.Now()
	expected := time.Date(timeNow.Year(), timeNow.Month(), timeNow.Day(), 0, 0, 0, 0, timeNow.Location())
	actual := others.TruncateToDay(timeNow)
	a.Equal(expected, actual)
}

func TestGetParamUint(t *testing.T) {
	a := assert.New(t)
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	var tests = []struct {
		hasError bool
		expected uint
		param    gin.Param
	}{
		// Success
		{false, 100, gin.Param{Key: "test", Value: "100"}},
		// Value is negative
		{true, 0, gin.Param{Key: "test", Value: "-100"}},
		// Value is not int
		{true, 0, gin.Param{Key: "test", Value: "hello"}},
		// Value is empty
		{true, 0, gin.Param{Key: "test", Value: ""}},
	}
	for _, test := range tests {
		c.Params = []gin.Param{test.param}
		actual, err := others.GetParamUint(c, "test")
		if err == nil {
			a.NoError(err)
		} else {
			a.Error(err)
		}
		a.Equal(test.expected, actual)
	}
}

func TestGetQueryUint(t *testing.T) {
	a := assert.New(t)
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()

	var tests = []struct {
		hasError   bool
		expected   uint
		queryValue string
	}{
		// Success
		{false, 100, "100"},
		// Value is negative
		{true, 0, "-100"},
		// Value is not int
		{true, 0, "hello"},
		// Value is empty
		{true, 0, ""},
	}
	for _, test := range tests {
		u := url.Values{}
		u.Add("test", test.queryValue)
		c, _ := gin.CreateTestContext(w)
		c.Request = &http.Request{
			Header: make(http.Header),
			URL:    &url.URL{},
		}
		c.Request.URL.RawQuery = u.Encode()
		actual, err := others.GetQueryUint(c, "test")
		if err == nil {
			a.NoError(err)
		} else {
			a.Error(err)
		}
		a.Equal(test.expected, actual)
	}
}

func TestHandleGormError(t *testing.T) {
	a := assert.New(t)
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()

	var tests = []struct {
		expected int
		err      error
	}{
		{http.StatusNotFound, gorm.ErrRecordNotFound},
		{http.StatusInternalServerError, errors.New("Error")},
	}
	for _, test := range tests {
		c, _ := gin.CreateTestContext(w)
		others.HandleGormError(c, test.err)
		a.Equal(test.expected, c.Writer.Status())
	}
}

func TestGetErrJSON(t *testing.T) {
	a := assert.New(t)
	errJson := *others.GetErrJSON("test")
	a.Equal(1, len(errJson))
	a.Equal("test", errJson["error"])
}

func TestGetJWTSecretKey(t *testing.T) {
	a := assert.New(t)
	v := others.GetJWTSecretKey()
	s := os.Getenv("JWT_SECRET_KEY")
	if len(s) == 0 {
		a.Equal([]byte("test"), v)
	} else {
		a.Equal([]byte(s), v)
	}
}
