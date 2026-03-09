#!/bin/bash

echo "🔧 Database Connection Fix Tool"
echo "==============================="
echo ""

# Backup current .env
cp .env .env.backup
echo "✅ Backed up .env to .env.backup"

# Check current DATABASE_URL
CURRENT_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"')
echo "📋 Current DATABASE_URL: $CURRENT_URL"
echo ""

# Check if using Neon
if [[ $CURRENT_URL == *"neon.tech"* ]]; then
    echo "🔄 Detected Neon database"
    
    # If not using pooler, suggest adding it
    if [[ $CURRENT_URL != *"-pooler"* ]]; then
        echo "⚠️ Not using connection pooler - this can cause timeout issues"
        
        # Add -pooler to hostname
        NEW_URL=$(echo $CURRENT_URL | sed 's/\.tech/-pooler.tech/')
        
        echo ""
        echo "💡 Suggested URL with pooler:"
        echo "   $NEW_URL"
        echo ""
        echo "Do you want to update DATABASE_URL to use pooler? (y/n)"
        read -r answer
        
        if [[ $answer == "y" || $answer == "Y" ]]; then
            # Update .env file
            sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$NEW_URL\"|" .env
            echo "✅ Updated DATABASE_URL to use connection pooler"
        fi
    fi
fi

# Add connection timeout settings to .env if not present
if ! grep -q "PG_CONNECTION_TIMEOUT" .env; then
    echo "" >> .env
    echo "# PostgreSQL connection settings" >> .env
    echo "PG_CONNECTION_TIMEOUT=30000" >> .env
    echo "PG_IDLE_TIMEOUT=30000" >> .env
    echo "PG_MAX_RETRIES=3" >> .env
    echo "PG_RETRY_DELAY=1000" >> .env
    echo "✅ Added PostgreSQL timeout settings to .env"
fi

echo ""
echo "🎉 Connection fixes applied!"
echo ""
echo "📋 Next steps:"
echo "   1. If using Neon, make sure your IP is whitelisted:"
echo "      https://console.neon.tech -> Project Settings -> IP Allow"
echo ""
echo "   2. Run the diagnostic tool:"
echo "      node diagnose-db-connection.js"
echo ""
echo "   3. Restart your dev server:"
echo "      npm run dev"
echo ""

chmod +x fix-db-connection.sh
