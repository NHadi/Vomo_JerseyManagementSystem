package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBUser     string
	DBPassword string
	DBName     string
	DBPort     string
}

func LoadConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBUser:     getEnv("DB_USER", "vomo_admin"),
		DBPassword: getEnv("DB_PASSWORD", "vomo_admin_123@#$"),
		DBName:     getEnv("DB_NAME", "vomo_production_managament"),
		DBPort:     getEnv("DB_PORT", "5432"),
	}, nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func (c *Config) GetDBPortInt() int {
	port, err := strconv.Atoi(c.DBPort)
	if err != nil {
		return 5432 // default postgres port if conversion fails
	}
	return port
}

func (c *Config) GetServerPort() string {
    port := getEnv("SERVER_PORT", "8080")
    return ":" + port
}
