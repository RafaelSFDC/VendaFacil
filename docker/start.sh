#!/bin/sh

# Script de inicialização para o container Docker

set -e

echo "🚀 Iniciando aplicação Laravel..."

# Aguardar um momento para garantir que tudo está pronto
sleep 2

# Verificar se o arquivo .env existe, se não, criar a partir do .env.example
if [ ! -f /var/www/html/.env ]; then
    echo "📝 Criando arquivo .env..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Gerar chave da aplicação se não existir
if ! grep -q "APP_KEY=base64:" /var/www/html/.env; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate --force
fi

# Criar diretório do banco de dados se não existir
mkdir -p /var/www/html/database

# Criar arquivo do banco SQLite se não existir
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "🗄️ Criando banco de dados SQLite..."
    touch /var/www/html/database/database.sqlite
fi

# Executar migrações
echo "🔄 Executando migrações do banco de dados..."
php artisan migrate --force

# Executar seeds apenas se for a primeira execução ou se forçado
if [ ! -f /var/www/html/storage/.seeded ] || [ "$FORCE_SEED" = "true" ]; then
    echo "🌱 Executando seeds do banco de dados..."
    php artisan db:seed --force

    # Remover dependências de desenvolvimento após seeds (se em produção)
    if [ "$APP_ENV" = "production" ]; then
        echo "🧹 Removendo dependências de desenvolvimento..."
        composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts
    fi

    # Marcar como seeded para evitar re-execução
    touch /var/www/html/storage/.seeded
    echo "✅ Seeds executados com sucesso!"
else
    echo "ℹ️ Seeds já foram executados anteriormente. Use FORCE_SEED=true para forçar re-execução."
fi

# Limpar e otimizar cache
echo "🧹 Limpando e otimizando cache..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Criar link simbólico para storage se não existir
if [ ! -L /var/www/html/public/storage ]; then
    echo "🔗 Criando link simbólico para storage..."
    php artisan storage:link
fi

# Ajustar permissões
echo "🔒 Ajustando permissões..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/database
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/database

echo "✅ Aplicação inicializada com sucesso!"

# Iniciar supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
