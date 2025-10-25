#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  C-C-Mart Backend - Local Docker Test${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}\n"

# Stop and remove existing containers
echo -e "${BLUE}Cleaning up existing containers...${NC}"
docker-compose down -v

# Build and start services
echo -e "\n${BLUE}Building Docker image...${NC}"
docker-compose build

echo -e "\n${BLUE}Starting services...${NC}"
docker-compose up -d

echo -e "\n${GREEN}Waiting for services to be ready...${NC}"
echo "This may take 30-60 seconds for the first run..."

# Wait for backend to be ready
max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        echo -e "\n${GREEN}✓ Backend is ready!${NC}\n"
        break
    fi
    echo -n "."
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "\n${RED}Error: Backend failed to start. Check logs with: docker-compose logs backend${NC}"
    exit 1
fi

# Display service information
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Services are running!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Backend:  ${GREEN}http://localhost:8080${NC}"
echo -e "Health:   ${GREEN}http://localhost:8080/api/health${NC}"
echo -e "MySQL:    ${GREEN}localhost:3306${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs:        ${GREEN}docker-compose logs -f backend${NC}"
echo -e "  Stop services:    ${GREEN}docker-compose down${NC}"
echo -e "  Restart:          ${GREEN}docker-compose restart${NC}"
echo -e "  Rebuild:          ${GREEN}docker-compose up -d --build${NC}"
echo -e "\n${GREEN}Press Ctrl+C to view logs (or run: docker-compose logs -f)${NC}\n"

# Follow logs
docker-compose logs -f
