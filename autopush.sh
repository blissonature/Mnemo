#!/bin/bash

echo "🔄 Adding all changes..."
git add .

echo "📝 Committing changes..."
git commit -m "feat: auto-update with latest Mnemo enhancements"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Done. Your memory palace is live at:"
echo "🌐 https://blissonature.github.io/Mnemo/"
