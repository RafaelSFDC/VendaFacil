#!/bin/sh

# Script de inicialização para desenvolvimento

set -e

echo "🚀 Iniciando aplicação Laravel em modo desenvolvimento..."

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

# Criar banco de dados se não existir
mkdir -p database
if [ ! -f database/database.sqlite ]; then
    echo "🗄️ Criando banco de dados SQLite..."
    touch database/database.sqlite
fi

# Executar migrações
echo "🔄 Executando migrações..."
php artisan migrate

# Criar link simbólico para storage
if [ ! -L public/storage ]; then
    echo "🔗 Criando link simbólico para storage..."
    php artisan storage:link
fi

# Ajustar permissões
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "✅ Aplicação de desenvolvimento inicializada!"

# Iniciar servidor de desenvolvimento Laravel em background
php artisan serve --host=0.0.0.0 --port=8000 &

# Iniciar Vite dev server em background
npm run dev -- --host 0.0.0.0 --port 5173 &

# Manter o container rodando
tail -f /dev/null
