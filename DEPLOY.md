# 🚀 Deploy - Venda Fácil

Guia completo para deploy da aplicação Venda Fácil no Render.com.

## 📋 Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Git](https://git-scm.com/) configurado
- Conta no [Render.com](https://render.com)
- Repositório Git (GitHub, GitLab, etc.)

## 🎯 Deploy Automático no Render.com

### 1. Configuração Inicial

1. **Fork/Clone** este repositório
2. **Configure** as variáveis de ambiente no Render.com
3. **Execute** o script de deploy

### 2. Scripts de Deploy

#### Deploy Rápido (Desenvolvimento)
```bash
# Linux/macOS
./scripts/deploy.sh

# Windows (PowerShell)
.\scripts\deploy-prod.ps1
```

#### Deploy de Produção (Recomendado)
```bash
# Linux/macOS
./scripts/deploy-prod.sh

# Windows (PowerShell)
.\scripts\deploy-prod.ps1 -Force
```

### 3. Configuração no Render.com

1. **Conecte** seu repositório
2. **Use** as configurações do arquivo `render.yaml`
3. **Defina** as variáveis de ambiente necessárias

#### Variáveis de Ambiente Obrigatórias:
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:... (gerado automaticamente)
APP_URL=https://vendafacil.onrender.com
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
```

#### Variáveis Opcionais:
```env
FORCE_SEED=false          # true para executar seeds
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=database
LOG_CHANNEL=stderr
LOG_LEVEL=info
```

## 🐳 Deploy Manual com Docker

### Build Local
```bash
# Build da imagem
docker build -t venda-facil .

# Executar localmente
docker run -p 8080:80 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_URL=http://localhost:8080 \
  venda-facil
```

### Docker Compose
```bash
# Produção
docker-compose up --build

# Desenvolvimento
docker-compose --profile dev up --build
```

## 🛠️ Desenvolvimento Local

### Sem Docker (Recomendado para Dev)

```bash
# Instalar dependências
composer install
npm install

# Configurar ambiente
cp .env.example .env
php artisan key:generate

# Banco de dados
php artisan migrate
php artisan db:seed

# Executar
php artisan serve &
npm run dev
```

### Com Docker (Teste de Produção)

```bash
# Ambiente completo
./scripts/dev.sh

# Apenas produção local
docker-compose up --build
```

## 📊 Monitoramento

### Health Check

- **Endpoint**: `/up`
- **Resposta**: `healthy`
- **Uso**: Monitoramento automático do Render.com

### Logs

```bash
# Ver logs do container
docker logs <container_name>

# Logs em tempo real
docker-compose logs -f

# Logs do Render.com
# Acesse o dashboard do Render.com
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Verificar dependências
npm run types
npm run lint

# Limpar cache
docker system prune -a
```

#### 2. Health Check Falha
```bash
# Testar localmente
curl http://localhost:8080/up

# Verificar logs
docker logs <container_name>
```

#### 3. Banco de Dados
```bash
# Recriar banco
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate --seed
```

### Comandos Úteis

```bash
# Verificar status dos containers
docker ps

# Acessar container
docker exec -it <container_name> bash

# Ver logs específicos
docker logs <container_name> --tail 100

# Reiniciar serviços
docker-compose restart
```

## 🌱 Seeds e Migrações

### Primeira Execução
- Seeds são executados automaticamente no primeiro deploy
- Para forçar re-execução: `FORCE_SEED=true`

### Migrações
- Executadas automaticamente a cada deploy
- Usar `--force` em produção

## 🔐 Segurança

### Configurações de Produção
- HTTPS forçado (`FORCE_HTTPS=true`)
- Debug desabilitado (`APP_DEBUG=false`)
- Logs direcionados para stderr
- Rate limiting configurado

### Variáveis Sensíveis
- `APP_KEY`: Gerada automaticamente
- Senhas: Usar variáveis de ambiente
- Tokens: Nunca commitar no código

## 📈 Performance

### Otimizações Aplicadas
- OPcache habilitado
- Gzip compression
- Cache de rotas/views/config
- Assets com versionamento
- CDN ready

### Monitoramento
- Health checks automáticos
- Logs estruturados
- Métricas de performance

## 🆘 Suporte

### Links Úteis
- [Documentação do Render.com](https://render.com/docs)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Contato
- Abra uma issue no repositório
- Consulte a documentação do Laravel
- Verifique os logs de deploy no Render.com
