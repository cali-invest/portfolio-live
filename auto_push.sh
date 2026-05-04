#!/bin/bash

cd "$(dirname "$0")"

echo "🔄 Adding files..."
git add .

echo "📝 Committing..."
git commit -m "auto update $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Pushing..."
git push

echo "✅ Done!"
