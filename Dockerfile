# Multi-stage build para otimizar o tamanho da imagem final
FROM node:22-alpine AS node-builder

WORKDIR /app

# Copiar arquivos de dependências do Node.js
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY .prettierrc ./
COPY eslint.config.js ./
COPY components.json ./

# Instalar dependências do Node.js
RUN npm ci --omit=dev --silent

# Copiar código fonte do frontend
COPY resources/ ./resources/
COPY public/ ./public/

# Build dos assets
RUN npm run build

# Stage 2: PHP Runtime
FROM php:8.4-fpm-alpine AS php-base

# Instalar dependências do sistema
RUN apk add --no-cache \
    nginx \
    supervisor \
    sqlite \
    sqlite-dev \
    zip \
    unzip \
    curl \
    oniguruma-dev \
    libxml2-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev

# Instalar extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_sqlite \
    pdo_mysql \
    mbstring \
    xml \
    zip \
    gd \
    opcache

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos de dependências do PHP
COPY composer.json composer.lock ./

# Instalar dependências do PHP (incluindo dev para seeds, depois remover)
RUN composer install --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Stage 3: Final Production Image
FROM php-base AS production

# Copiar código fonte da aplicação
COPY . .

# Copiar assets buildados do stage anterior
COPY --from=node-builder /app/public/build ./public/build

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copiar configurações do Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default-https.conf /etc/nginx/http.d/default.conf

# Copiar configuração do Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copiar script de inicialização
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Configurar PHP para produção
COPY docker/php.ini /usr/local/etc/php/conf.d/99-custom.ini

# Criar diretórios necessários
RUN mkdir -p /var/log/supervisor \
    && mkdir -p /run/nginx \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views

# Expor porta
EXPOSE 80

# Comando de inicialização
CMD ["/usr/local/bin/start.sh"]
