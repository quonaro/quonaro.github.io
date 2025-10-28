#!/bin/bash

# Deploy script for main branch
# This script builds the project and pushes it to the main branch

set -e

echo "🚀 Starting deployment to main branch..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Stash any uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "💾 Stashing uncommitted changes..."
    git stash push -m "Auto-stash before deploy $(date)"
fi

# Create or checkout main branch
echo "🔄 Switching to main branch..."
git checkout -B main

# Remove all files except .git and dist
echo "🧹 Cleaning main branch..."
find . -maxdepth 1 -not -name '.git' -not -name '.' -not -name 'dist' -exec rm -rf {} + 2>/dev/null || true

# Copy built files from dist to root
echo "📋 Copying built files..."
cp -r dist/* . 2>/dev/null || {
    echo "❌ Error: dist directory not found. Make sure to run 'npm run build' first."
    exit 1
}

# Add all files
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to deploy"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to main branch
    echo "🚀 Pushing to main branch..."
    git push origin main --force
    
    echo "✅ Successfully deployed to main branch!"
fi

# Return to original branch
echo "🔄 Returning to original branch: $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH

# Restore stashed changes if any
if git stash list | grep -q "Auto-stash before deploy"; then
    echo "📤 Restoring stashed changes..."
    git stash pop
fi

echo "🎉 Deployment completed!"
