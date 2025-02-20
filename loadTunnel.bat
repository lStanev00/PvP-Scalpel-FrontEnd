@echo off

REM Load the port number from .env
for /f "tokens=2 delims==" %%A in ('findstr /R "^PORT=" .env') do set PORT=%%A
for /f "tokens=2 delims==" %%A in ('findstr /R "^TUNNELNAME=" .env') do set TUNNELNAME=%%A

REM Run Cloudflared with the extracted port and tunel name
cloudflared tunnel --url http://localhost:%PORT% run %TUNNELNAME%

pause