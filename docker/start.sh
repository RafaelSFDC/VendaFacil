#!/bin/sh

# Script de inicialização para produção

set -e

echo "🚀 Iniciando aplicação Venda Fácil em modo produção..."

# Verificar se o arquivo .env existe, se não, criar a partir do .env.example
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Gerar chave da aplicação se não existir
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate --force
fi

# Criar diretório do banco de dados se não existir
if [ ! -f database/database.sqlite ]; then
    echo "🗄️ Criando banco de dados SQLite..."
    touch database/database.sqlite
fi

# Executar migrações
echo "🔄 Executando migrações..."
php artisan migrate --force

# Executar seeds se FORCE_SEED estiver definido
if [ "$FORCE_SEED" = "true" ]; then
    echo "🌱 Executando seeds..."
    php artisan db:seed --force
fi

# Limpar e otimizar caches
echo "🧹 Otimizando aplicação..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Criar links simbólicos para storage
echo "🔗 Criando links simbólicos..."
php artisan storage:link

# Configurar permissões
echo "🔐 Configurando permissões..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/database

# Iniciar supervisor (que gerencia nginx e php-fpm)
echo "🎯 Iniciando serviços..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
