@echo off

REM Load the TESTDEV number from .env
for /f "tokens=2 delims==" %%A in ('findstr /R "^TESTDEV=" .env') do set TESTDEV=%%A
for /f "tokens=2 delims==" %%A in ('findstr /R "^TUNNELNAME=" .env') do set TUNNELNAME=%%A

REM Run Cloudflared with the extracted TESTDEV and tunel name
cloudflared tunnel --url http://localhost:%TESTDEV% run %TUNNELNAME%

pause