#!/bin/bash

# Script de deploy para o Render.com

set -e

echo "🚀 Preparando deploy para o Render.com..."

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

# Verificar se o Git está configurado
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "❌ Erro: Configure o Git primeiro (git config user.name e user.email)"
    exit 1
fi

# Executar testes TypeScript
echo "🔍 Verificando tipos TypeScript..."
npm run types

# Executar linting
echo "🧹 Executando linting..."
npm run lint

# Executar formatação
echo "💅 Formatando código..."
npm run format

# Build local para testar
echo "🏗️ Testando build local..."
docker build -t venda-facil:test .

# Testar se a imagem funciona
echo "🧪 Testando container..."
docker run --rm -d --name venda-facil-test -p 8081:80 venda-facil:test

# Aguardar o container inicializar
sleep 10

# Testar health check
if curl -f http://localhost:8081/up > /dev/null 2>&1; then
    echo "✅ Health check passou!"
else
    echo "❌ Health check falhou!"
    docker logs venda-facil-test
    docker stop venda-facil-test
    exit 1
fi

# Parar container de teste
docker stop venda-facil-test

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Commitando mudanças..."
    git add .
    git commit -m "Deploy: Preparação para produção

- Verificações de qualidade executadas
- Build testado localmente
- Health check validado"
fi

# Push para o repositório
echo "🚀 Fazendo push para o repositório..."
git push

echo "✅ Deploy preparado! O Render.com irá automaticamente fazer o deploy da nova versão."
echo "🌐 Acesse: https://dashboard.render.com para acompanhar o progresso"
echo "📱 URL da aplicação: https://venda-facil.onrender.com"
echo ""
echo "🌱 Seeds serão executados automaticamente no primeiro deploy"
echo "🔧 Para forçar re-execução dos seeds, defina FORCE_SEED=true no Render.com"
