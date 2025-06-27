#!/bin/bash

# Script de deploy para produção com HTTPS e seeds

set -e

echo "🚀 Preparando deploy para produção..."

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
docker build -t vendafacil:prod .

# Testar se a imagem funciona
echo "🧪 Testando container de produção..."
docker run --rm -d --name vendafacil-prod-test \
    -p 8082:80 \
    -e APP_ENV=production \
    -e APP_DEBUG=false \
    -e APP_URL=https://vendafacil.onrender.com \
    -e FORCE_HTTPS=true \
    -e FORCE_SEED=true \
    vendafacil:prod

# Aguardar o container inicializar
echo "⏳ Aguardando inicialização..."
sleep 15

# Testar health check
echo "🔍 Testando health check..."
if curl -f http://localhost:8082/up > /dev/null 2>&1; then
    echo "✅ Health check passou!"
else
    echo "❌ Health check falhou!"
    echo "📋 Logs do container:"
    docker logs vendafacil-prod-test
    docker stop vendafacil-prod-test
    exit 1
fi

# Verificar se os seeds foram executados
echo "🌱 Verificando execução dos seeds..."
docker exec vendafacil-prod-test ls -la /var/www/html/storage/.seeded > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Seeds foram executados com sucesso!"
else
    echo "⚠️ Seeds podem não ter sido executados"
fi

# Parar container de teste
docker stop vendafacil-prod-test

# Limpar imagem de teste
docker rmi vendafacil:prod

echo "✅ Testes de produção passaram!"

# Perguntar se deve continuar com o deploy
read -p "🚀 Continuar com o deploy? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado pelo usuário"
    exit 0
fi

# Adicionar mudanças ao Git
echo "📝 Adicionando mudanças ao Git..."
git add .

# Verificar se há mudanças para commit
if git diff --staged --quiet; then
    echo "ℹ️ Nenhuma mudança para commit"
else
    # Commit das mudanças
    echo "💾 Fazendo commit das mudanças..."
    read -p "Digite a mensagem do commit: " commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Deploy: configuração HTTPS e seeds para produção"
    fi
    git commit -m "$commit_message"
fi

# Push para o repositório
echo "🚀 Fazendo push para o repositório..."
git push

echo ""
echo "✅ Deploy para produção concluído!"
echo "🌐 Acesse: https://dashboard.render.com para acompanhar o progresso"
echo "📱 URL da aplicação: https://vendafacil.onrender.com"
echo ""
echo "📋 Configurações aplicadas:"
echo "   ✓ HTTPS forçado em produção"
echo "   ✓ Seeds executados automaticamente"
echo "   ✓ Headers de segurança configurados"
echo "   ✓ Cache otimizado para assets"
echo ""
echo "🔧 Para forçar re-execução dos seeds, defina FORCE_SEED=true no Render.com"
