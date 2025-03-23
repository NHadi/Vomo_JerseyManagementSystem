package jwt

import (
	"fmt"
	"time"
	"vomo/internal/domain/common"
	"vomo/internal/domain/user"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

var (
	jwtSecret        []byte
	jwtRefreshSecret []byte
)

// SetSecrets initializes the JWT secrets
func SetSecrets(secret, refreshSecret string) {
	jwtSecret = []byte(secret)
	jwtRefreshSecret = []byte(refreshSecret)
}

func GenerateAccessToken(user *user.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   user.ID.String(),
		"tenant_id": user.TenantModel.TenantID,
		"username":  user.Username,
		"exp":       time.Now().Add(time.Hour * 1).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func GenerateRefreshToken(user *user.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   user.ID.String(),
		"tenant_id": user.TenantModel.TenantID,
		"username":  user.Username,
		"exp":       time.Now().Add(time.Hour * 24 * 7).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtRefreshSecret)
}

// Update ValidateToken to use the package-level secret
func ValidateToken(tokenString string) (*user.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	return extractUserFromClaims(claims)
}

// Update ValidateRefreshToken to use the package-level refresh secret
func ValidateRefreshToken(tokenString string) (*user.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtRefreshSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid refresh token claims")
	}

	return extractUserFromClaims(claims)
}

func extractUserFromClaims(claims jwt.MapClaims) (*user.User, error) {
	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return nil, fmt.Errorf("user_id not found in token")
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user_id format")
	}

	tenantID, ok := claims["tenant_id"].(float64)
	if !ok {
		return nil, fmt.Errorf("tenant_id not found in token")
	}

	username, ok := claims["username"].(string)
	if !ok {
		return nil, fmt.Errorf("username not found in token")
	}

	return &user.User{
		ID:       userID,
		Username: username,
		TenantModel: common.TenantModel{
			TenantID: int(tenantID),
		},
	}, nil
}
