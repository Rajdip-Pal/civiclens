#!/bin/bash

# CivicLens Local Setup Script

echo "🏗️  Setting up CivicLens locally..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"

# Install root dependencies
echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
npm install

# Setup backend
echo -e "${YELLOW}📦 Setting up backend...${NC}"
cd backend

if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update backend/.env with your credentials${NC}"
fi

if [ ! -f serviceAccountKey.json ]; then
    echo -e "${YELLOW}⚠️  Please download Firebase service account key to backend/serviceAccountKey.json${NC}"
fi

npm install
cd ..

# Setup frontend
echo -e "${YELLOW}📦 Setting up frontend...${NC}"
cd frontend

if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update frontend/.env with your Firebase config${NC}"
fi

npm install
cd ..

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Google Cloud and Firebase credentials"
echo "2. Download Firebase service account key to backend/serviceAccountKey.json"
echo "3. Update frontend/.env with your Firebase web config"
echo "4. Run 'npm run dev' to start both backend and frontend"
echo ""
echo "For deployment, run './deploy.sh'"
