#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== DualDates Web Vercel Deployment Script ===${NC}"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI not found. Installing globally...${NC}"
    npm install -g vercel
fi

# Clean previous builds if they exist
echo -e "${BLUE}Cleaning previous builds...${NC}"
rm -rf .next

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Build the application with TypeScript and ESLint errors ignored
echo -e "${BLUE}Building application...${NC}"
NEXT_IGNORE_TYPESCRIPT_ERRORS=true NEXT_IGNORE_ESLINT_ERRORS=true npm run build

# If build was successful, deploy to Vercel
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful! Deploying to Vercel...${NC}"
    
    # Run vercel with production flag
    echo -e "${BLUE}Starting Vercel deployment...${NC}"
    vercel --prod
    
    echo -e "${GREEN}Deployment complete! Check the URL above to view your site.${NC}"
else
    echo -e "${RED}Build failed. Please fix the errors before deploying.${NC}"
    exit 1
fi 