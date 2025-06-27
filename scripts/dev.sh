#!/bin/bash

# Script para desenvolvimento local com Docker

set -e

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Docker não está instalado"
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Erro: Docker Compose não está instalado"
    exit 1
fi

# Função para limpar recursos
cleanup() {
    echo "🧹 Limpando recursos..."
    docker-compose --profile dev down
}

# Configurar trap para cleanup
trap cleanup EXIT

# Parar containers existentes
docker-compose --profile dev down

# Build e iniciar containers de desenvolvimento
echo "🏗️ Construindo e iniciando containers..."
docker-compose --profile dev up --build -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 15

# Verificar se os serviços estão rodando
echo "🔍 Verificando serviços..."

if curl -f http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Laravel está rodando em http://localhost:8000"
else
    echo "❌ Laravel não está respondendo"
    docker-compose --profile dev logs dev
fi

if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Vite está rodando em http://localhost:5173"
else
    echo "⚠️ Vite pode estar iniciando ainda..."
fi

echo ""
echo "🎉 Ambiente de desenvolvimento iniciado!"
echo "📱 Laravel: http://localhost:8000"
echo "⚡ Vite: http://localhost:5173"
echo "🐳 Produção: http://localhost:8080"
echo ""
echo "📋 Comandos úteis:"
echo "  docker-compose --profile dev logs -f    # Ver logs"
echo "  docker-compose --profile dev exec dev bash  # Acessar container"
echo "  docker-compose --profile dev down       # Parar containers"
echo ""
echo "Pressione Ctrl+C para parar os containers"

# Manter o script rodando e mostrar logs
docker-compose --profile dev logs -f
