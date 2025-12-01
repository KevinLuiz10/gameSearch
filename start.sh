#!/bin/bash

echo "Derrubando containers antigos..."
docker compose down

echo "Construindo e subindo o ambiente de desenvolvimento..."
docker compose up --build

# O comando 'read' abaixo simula o 'pause' do Windows
read -p "Pressione [Enter] para sair..."