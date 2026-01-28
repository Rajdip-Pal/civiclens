#!/bin/bash

# CivicLens - Pre-deployment Verification Script

echo "🔍 CivicLens Pre-Deployment Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗ npm not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check gcloud
echo -n "Checking gcloud CLI... "
if command -v gcloud &> /dev/null; then
    GCLOUD_VERSION=$(gcloud --version | head -n 1)
    echo -e "${GREEN}✓${NC} $GCLOUD_VERSION"
else
    echo -e "${YELLOW}⚠ gcloud not found (needed for deployment)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check firebase
echo -n "Checking Firebase CLI... "
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    echo -e "${GREEN}✓${NC} v$FIREBASE_VERSION"
else
    echo -e "${YELLOW}⚠ Firebase CLI not found (needed for deployment)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📁 Checking Project Structure"
echo "=============================="

# Check backend
echo -n "Backend directory... "
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check frontend
echo -n "Frontend directory... "
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check backend dependencies
echo -n "Backend node_modules... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run: cd backend && npm install${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check frontend dependencies
echo -n "Frontend node_modules... "
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run: cd frontend && npm install${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "🔧 Checking Configuration Files"
echo "================================"

# Backend .env
echo -n "Backend .env... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC}"

    # Check for required variables
    if grep -q "GEMINI_API_KEY=your-" backend/.env; then
        echo -e "  ${YELLOW}⚠ Update GEMINI_API_KEY${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    if grep -q "GCP_PROJECT_ID=your-" backend/.env; then
        echo -e "  ${YELLOW}⚠ Update GCP_PROJECT_ID${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗ Missing (copy from .env.example)${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Backend service account
echo -n "Service Account Key... "
if [ -f "backend/serviceAccountKey.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Download from Firebase Console${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Frontend .env
echo -n "Frontend .env... "
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC}"

    if grep -q "VITE_FIREBASE_API_KEY=your-" frontend/.env; then
        echo -e "  ${YELLOW}⚠ Update Firebase config${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗ Missing (copy from .env.example)${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Firebase config
echo -n "firebase.json... "
if [ -f "firebase.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Firestore rules
echo -n "firestore.rules... "
if [ -f "firestore.rules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📄 Checking Documentation"
echo "========================="

docs=("README.md" "QUICKSTART.md" "PROJECT_SUMMARY.md" "docs/API.md" "docs/DEPLOYMENT.md" "docs/DEVELOPMENT.md")

for doc in "${docs[@]}"; do
    echo -n "$doc... "
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
done

echo ""
echo "🧪 Running Quick Tests"
echo "======================"

# Test backend TypeScript compilation
echo -n "Backend TypeScript... "
cd backend
if npm run build &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Compilation errors${NC}"
    ERRORS=$((ERRORS + 1))
fi
cd ..

# Test frontend TypeScript compilation
echo -n "Frontend TypeScript... "
cd frontend
if npm run build &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Compilation errors${NC}"
    ERRORS=$((ERRORS + 1))
fi
cd ..

echo ""
echo "📊 Summary"
echo "=========="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "${GREEN}✓ Ready for deployment${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warnings found${NC}"
    echo -e "${YELLOW}⚠ Review warnings before deploying${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS errors found${NC}"
    echo -e "${YELLOW}⚠ $WARNINGS warnings found${NC}"
    echo -e "${RED}✗ Fix errors before deploying${NC}"
    exit 1
fi
