package controllers_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"

	"github.com/FR0ST1N/MyDailies/api/auth"
	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type TestData struct {
	json    string
	code    int
	message string
}

func (t *TestData) NewHttpRequest(a *assert.Assertions, r *gin.Engine, method string, url string, setAuth bool, admin bool) *httptest.ResponseRecorder {
	// Make request
	w := httptest.NewRecorder()
	request, err := http.NewRequest(method, url, bytes.NewBuffer([]byte(t.json)))

	if setAuth {
		// Generate JWT
		token, err := auth.GenerateJWT(&models.User{Email: "john@example.com", ID: 1, Admin: admin, Name: "John"})
		a.NoError(err)
		request.Header.Set("Authorization", "Bearer "+token)
	}
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")
	a.NoError(err)
	r.ServeHTTP(w, request)
	a.Equal(t.code, w.Code, t.message)
	return w
}
