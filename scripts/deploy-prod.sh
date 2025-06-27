#!/bin/bash

# Script de deploy de produção para o Render.com
# Este script executa verificações mais rigorosas antes do deploy

set -e

echo "🚀 Preparando deploy de PRODUÇÃO para o Render.com..."

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

# Executar verificações de qualidade
echo "🔍 Verificando tipos TypeScript..."
npm run types

echo "🧹 Executando linting..."
npm run lint

echo "💅 Formatando código..."
npm run format

# Build local para testar
echo "🏗️ Construindo imagem de produção..."
docker build -t venda-facil:prod .

# Testar se a imagem funciona
echo "🧪 Testando container de produção..."
docker run --rm -d --name venda-facil-prod-test \
    -p 8082:80 \
    -e APP_ENV=production \
    -e APP_DEBUG=false \
    -e APP_URL=https://vendafacil.onrender.com \
    -e FORCE_HTTPS=true \
    -e FORCE_SEED=true \
    -e INERTIA_SSR_ENABLED=false \
    -e VITE_APP_NAME="Venda Fácil" \
    venda-facil:prod

# Aguardar o container inicializar
sleep 15

# Testar health check
if curl -f http://localhost:8082/up > /dev/null 2>&1; then
    echo "✅ Health check de produção passou!"
else
    echo "❌ Health check de produção falhou!"
    docker logs venda-facil-prod-test
    docker stop venda-facil-prod-test
    exit 1
fi

# Testar algumas rotas básicas
echo "🔍 Testando rotas básicas..."
if curl -f http://localhost:8082/ > /dev/null 2>&1; then
    echo "✅ Rota principal funcionando!"
else
    echo "⚠️ Rota principal não está respondendo (pode ser normal se requer autenticação)"
fi

# Parar container de teste
docker stop venda-facil-prod-test

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Commitando mudanças de produção..."
    git add .
    git commit -m "Deploy de produção: Venda Fácil

- Todas as verificações de qualidade executadas
- Build de produção testado localmente
- Health check validado
- Rotas básicas testadas"
fi

# Confirmar deploy de produção
echo ""
echo "⚠️  ATENÇÃO: Você está prestes a fazer deploy de PRODUÇÃO!"
echo "🌐 URL: https://vendafacil.onrender.com"
echo ""
read -p "Confirma o deploy de produção? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado pelo usuário"
    exit 1
fi

# Push para o repositório
echo "🚀 Fazendo push para produção..."
git push

echo ""
echo "✅ Deploy de produção iniciado!"
echo "🌐 Acesse: https://dashboard.render.com para acompanhar o progresso"
echo "📱 URL da aplicação: https://vendafacil.onrender.com"
echo ""
echo "⏳ O deploy pode levar alguns minutos para ser concluído"
echo "🔄 O Render.com irá automaticamente:"
echo "   - Fazer build da aplicação"
echo "   - Executar migrações"
echo "   - Executar seeds (se FORCE_SEED=true)"
echo "   - Iniciar a aplicação"
