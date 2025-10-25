#!/bin/bash

echo "======================================"
echo "  JWT Secret Generator"
echo "======================================"
echo ""

if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    echo "Your secure JWT secret:"
    echo ""
    echo "  $SECRET"
    echo ""
    echo "Copy this value and use it as JWT_SECRET"
    echo "in your environment variables on Render."
    echo ""
else
    echo "OpenSSL not found. Generating random string..."
    SECRET=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
    echo "Your JWT secret:"
    echo ""
    echo "  $SECRET"
    echo ""
fi

echo "======================================"
