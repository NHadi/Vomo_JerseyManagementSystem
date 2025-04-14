#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Update system packages
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create necessary directories
echo "Creating required directories..."
sudo mkdir -p /var/lib/postgresql/data
sudo mkdir -p /var/lib/elasticsearch/data
sudo mkdir -p /var/lib/vomo/uploads

# Set proper permissions
echo "Setting directory permissions..."
sudo chown -R 999:999 /var/lib/postgresql/data
sudo chown -R 1000:1000 /var/lib/elasticsearch/data
sudo chown -R $USER:$USER /var/lib/vomo

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Build and start containers
echo "Building and starting containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Check if all services are running
echo "Checking service status..."
docker-compose ps

echo "Deployment completed successfully!" 