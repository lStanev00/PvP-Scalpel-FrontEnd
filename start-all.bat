@echo off
title PvP Scalpel - Startup

echo Starting Cloudflare Tunnel...
start cmd /k "loadTunnel.bat"

echo Starting DBMS...
cd /d ".\V3-React-Vite-Express\DBMS"
start cmd /k "node DBMS.js"

echo Starting QUERY...
cd /d ".\src\querry"
start cmd /k "node load.js"

echo Starting Node Server...
cd /d "..\..\..\front-end"
start cmd /k "node server.mjs"

echo All processes started!