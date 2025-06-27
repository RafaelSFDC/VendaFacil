#!/bin/sh

# Script de inicialização para desenvolvimento

set -e

echo "🚀 Iniciando aplicação Venda Fácil em modo desenvolvimento..."

# Instalar dependências se não existirem
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependências PHP..."
    composer install
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências Node.js..."
    npm install
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Gerar chave da aplicação se não existir
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate
fi

# Criar diretório do banco de dados se não existir
if [ ! -f database/database.sqlite ]; then
    echo "🗄️ Criando banco de dados SQLite..."
    touch database/database.sqlite
fi

# Executar migrações
echo "🔄 Executando migrações..."
php artisan migrate

# Executar seeds
echo "🌱 Executando seeds..."
php artisan db:seed

# Criar links simbólicos para storage
echo "🔗 Criando links simbólicos..."
php artisan storage:link

# Limpar caches de desenvolvimento
echo "🧹 Limpando caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Iniciar servidor Laravel em background
echo "🎯 Iniciando servidor Laravel..."
php artisan serve --host=0.0.0.0 --port=8000 &

# Iniciar Vite em background
echo "⚡ Iniciando Vite..."
npm run dev -- --host 0.0.0.0 --port 5173 &

# Aguardar processos
wait
