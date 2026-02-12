#!/bin/bash

# API endpoint
url="http://localhost:8888/auth/login"

# Email and password
email="user@email.com"
password="pass123"

# Output file for the token
output_file="token.txt"

# Make the POST request and extract the token from the response
response=$(curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\", \"password\":\"$password\"}" $url)

# Save the response (or token) to a file
echo "$response" >"$output_file"

echo "Token saved to $output_file"
