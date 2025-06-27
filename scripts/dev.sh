#!/bin/bash

# Script para desenvolvimento com Docker

set -e

echo "🚀 Iniciando ambiente de desenvolvimento com Docker..."

# Função de cleanup
cleanup() {
    echo "🧹 Limpando containers..."
    docker-compose --profile dev down
}

# Verificar se estamos no diretório correto
if [ ! -f "composer.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Laravel"
    exit 1
fi

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
    echo "⚠️ Vite pode não estar rodando (normal se não há frontend ativo)"
fi

echo ""
echo "🎉 Ambiente de desenvolvimento iniciado!"
echo "🌐 Laravel: http://localhost:8000"
echo "⚡ Vite: http://localhost:5173"
echo ""
echo "📋 Comandos úteis:"
echo "   docker-compose --profile dev logs -f     # Ver logs em tempo real"
echo "   docker-compose --profile dev exec dev bash  # Acessar container"
echo "   docker-compose --profile dev down        # Parar containers"
echo ""
echo "🔄 Para parar o ambiente, pressione Ctrl+C ou execute:"
echo "   docker-compose --profile dev down"

# Manter o script rodando para mostrar logs
echo "📊 Mostrando logs (Ctrl+C para sair)..."
docker-compose --profile dev logs -f
