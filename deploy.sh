#!/bin/bash

# DAMAC Frontend Deployment Script

echo "🚀 Starting DAMAC Frontend Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Create production environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found. Please create it with your production settings."
    exit 1
fi

# Build for production
echo "🔨 Building for production..."
npm run build

# The built files are in the 'dist' directory
echo "✅ Build complete! Files are ready in the 'dist' directory."
echo "📁 Deploy the contents of 'dist/' to your web server."

# Optional: Start preview server
if [ "$1" == "preview" ]; then
    echo "👀 Starting preview server..."
    npm run preview
fi
