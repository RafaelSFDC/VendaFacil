# Script de deploy de produção para o Render.com (PowerShell)
# Este script executa verificações mais rigorosas antes do deploy

param(
    [switch]$Force
)

Write-Host "🚀 Preparando deploy de PRODUÇÃO para o Render.com..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "composer.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto Laravel" -ForegroundColor Red
    exit 1
}

# Verificar se o Docker está instalado
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Erro: Docker não está instalado" -ForegroundColor Red
    exit 1
}

# Verificar se o Git está configurado
$gitUserName = git config user.name
$gitUserEmail = git config user.email
if (-not $gitUserName -or -not $gitUserEmail) {
    Write-Host "❌ Erro: Configure o Git primeiro (git config user.name e user.email)" -ForegroundColor Red
    exit 1
}

# Executar verificações de qualidade
Write-Host "🔍 Verificando tipos TypeScript..." -ForegroundColor Yellow
npm run types
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na verificação de tipos" -ForegroundColor Red
    exit 1
}

Write-Host "🧹 Executando linting..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no linting" -ForegroundColor Red
    exit 1
}

Write-Host "💅 Formatando código..." -ForegroundColor Yellow
npm run format
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na formatação" -ForegroundColor Red
    exit 1
}

# Build local para testar
Write-Host "🏗️ Construindo imagem de produção..." -ForegroundColor Yellow
docker build -t venda-facil:prod .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build da imagem Docker" -ForegroundColor Red
    exit 1
}

# Testar se a imagem funciona
Write-Host "🧪 Testando container de produção..." -ForegroundColor Yellow
$containerId = docker run --rm -d --name venda-facil-prod-test `
    -p 8082:80 `
    -e APP_ENV=production `
    -e APP_DEBUG=false `
    -e APP_URL=https://venda-facil.onrender.com `
    -e FORCE_HTTPS=true `
    -e FORCE_SEED=true `
    venda-facil:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao iniciar container de teste" -ForegroundColor Red
    exit 1
}

# Aguardar o container inicializar
Write-Host "⏳ Aguardando container inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Testar health check
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/up" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check de produção passou!" -ForegroundColor Green
    } else {
        throw "Status code: $($response.StatusCode)"
    }
} catch {
    Write-Host "❌ Health check de produção falhou!" -ForegroundColor Red
    docker logs venda-facil-prod-test
    docker stop venda-facil-prod-test
    exit 1
}

# Testar algumas rotas básicas
Write-Host "🔍 Testando rotas básicas..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Rota principal funcionando!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Rota principal não está respondendo (pode ser normal se requer autenticação)" -ForegroundColor Yellow
}

# Parar container de teste
docker stop venda-facil-prod-test

# Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Commitando mudanças de produção..." -ForegroundColor Yellow
    git add .
    git commit -m "Deploy de produção: Venda Fácil

- Todas as verificações de qualidade executadas
- Build de produção testado localmente
- Health check validado
- Rotas básicas testadas"
}

# Confirmar deploy de produção
if (-not $Force) {
    Write-Host ""
    Write-Host "⚠️  ATENÇÃO: Você está prestes a fazer deploy de PRODUÇÃO!" -ForegroundColor Red
    Write-Host "🌐 URL: https://venda-facil.onrender.com" -ForegroundColor Cyan
    Write-Host ""
    $confirmation = Read-Host "Confirma o deploy de produção? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "❌ Deploy cancelado pelo usuário" -ForegroundColor Red
        exit 1
    }
}

# Push para o repositório
Write-Host "🚀 Fazendo push para produção..." -ForegroundColor Green
git push

Write-Host ""
Write-Host "✅ Deploy de produção iniciado!" -ForegroundColor Green
Write-Host "🌐 Acesse: https://dashboard.render.com para acompanhar o progresso" -ForegroundColor Cyan
Write-Host "📱 URL da aplicação: https://venda-facil.onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ O deploy pode levar alguns minutos para ser concluído" -ForegroundColor Yellow
Write-Host "🔄 O Render.com irá automaticamente:" -ForegroundColor Yellow
Write-Host "   - Fazer build da aplicação" -ForegroundColor White
Write-Host "   - Executar migrações" -ForegroundColor White
Write-Host "   - Executar seeds (se FORCE_SEED=true)" -ForegroundColor White
Write-Host "   - Iniciar a aplicação" -ForegroundColor White
