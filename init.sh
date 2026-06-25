#!/bin/bash
# init.sh

INSTALL_CMD="cd simdp-frontend && npm install"
VERIFY_CMD="cd simdp-frontend && npm run build && npm run preview"
START_CMD="cd simdp-frontend && npm run dev"

echo "Current directory: $(pwd)"
echo "Installing dependencies..."
eval $INSTALL_CMD

echo "Running verification..."
if eval $VERIFY_CMD; then
    echo "Verification passed."
    echo "To start the development server, run:"
    echo "$START_CMD"
    if [ "$RUN_START_COMMAND" = "1" ]; then
        eval $START_CMD
    fi
else
    echo "Verification failed. Please fix issues before proceeding."
    exit 1
fi
