#!/bin/bash
cd /home/kavia/workspace/code-generation/delivery-tracker-47650-47677/frontend_reactjs
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

