@echo off
echo Derrubando containers antigos...
docker-compose down

echo Construindo e subindo o ambiente de desenvolvimento...
docker-compose up --build
pause