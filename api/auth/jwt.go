package auth

import (
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/golang-jwt/jwt/v4"
)

type JWTClaim struct {
	UserID uint   `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Admin  bool   `json:"admin"`
	jwt.StandardClaims
}

func GenerateJWT(u *models.User) (string, error) {
	t := time.Now().Add(24 * time.Hour * 7) // A week from now
	claims := &JWTClaim{
		Name:   u.Name,
		Email:  u.Email,
		Admin:  u.Admin,
		UserID: u.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: t.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(others.GetJWTSecretKey())
}

func ValidateToken(signedToken string) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return others.GetJWTSecretKey(), nil
		},
	)
	return token, err
}
