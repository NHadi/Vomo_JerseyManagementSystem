package middleware

import (
	"fmt"
	"time"
	"vomo/internal/config"
	"vomo/internal/domain/common"
	"vomo/internal/domain/user"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

func GenerateAccessToken(user *user.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   user.ID,
		"tenant_id": user.TenantModel.TenantID,
		"username":  user.Username,
		"exp":       time.Now().Add(time.Hour * 1).Unix(), // 1 hour expiry
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetConfig().JWTSecret))
}

func GenerateRefreshToken(user *user.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   user.ID,
		"tenant_id": user.TenantModel.TenantID,
		"username":  user.Username,
		"exp":       time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days expiry
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetConfig().JWTRefreshSecret))
}

func ValidateToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetConfig().JWTSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}

func ValidateRefreshToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetConfig().JWTRefreshSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid refresh token claims")
	}

	return claims, nil
}

func ExtractTokenMetadata(claims jwt.MapClaims) (*user.User, error) {
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
