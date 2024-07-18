ECHO Pushing back-end to production!
set server_location=miller@10.0.0.182:/var/drive-backend/
set base_dir=C:\projects\media-server\media-server-back-end

scp "%base_dir%\.env" "%server_location%"
scp -r "%base_dir%\src" "%server_location%"
scp "%base_dir%\package-lock.json" "%server_location%"
scp "%base_dir%\package.json" "%server_location%"
scp "%base_dir%\.env.development" "%server_location%"
scp "%base_dir%\.env.production" "%server_location%"