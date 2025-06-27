# Script de deploy para produção com HTTPS e seeds (PowerShell)

param(
    [switch]$Force,
    [string]$CommitMessage = "Deploy: configuração HTTPS e seeds para produção"
)

Write-Host "🚀 Preparando deploy para produção..." -ForegroundColor Green

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
$gitUser = git config user.name
$gitEmail = git config user.email
if (-not $gitUser -or -not $gitEmail) {
    Write-Host "❌ Erro: Configure o Git primeiro (git config user.name e user.email)" -ForegroundColor Red
    exit 1
}

# Executar verificações de qualidade
Write-Host "🔍 Verificando tipos TypeScript..." -ForegroundColor Yellow
npm run types
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro nos tipos TypeScript" -ForegroundColor Red
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
docker build -t vendafacil:prod .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build da imagem Docker" -ForegroundColor Red
    exit 1
}

# Testar se a imagem funciona
Write-Host "🧪 Testando container de produção..." -ForegroundColor Yellow
$containerId = docker run --rm -d --name vendafacil-prod-test `
    -p 8082:80 `
    -e APP_ENV=production `
    -e APP_DEBUG=false `
    -e APP_URL=https://vendafacil.onrender.com `
    -e FORCE_HTTPS=true `
    -e FORCE_SEED=true `
    vendafacil:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao iniciar container de teste" -ForegroundColor Red
    exit 1
}

# Aguardar o container inicializar
Write-Host "⏳ Aguardando inicialização..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Testar health check
Write-Host "🔍 Testando health check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/up" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passou!" -ForegroundColor Green
    } else {
        throw "Health check falhou com status: $($response.StatusCode)"
    }
} catch {
    Write-Host "❌ Health check falhou!" -ForegroundColor Red
    Write-Host "📋 Logs do container:" -ForegroundColor Yellow
    docker logs vendafacil-prod-test
    docker stop vendafacil-prod-test
    docker rmi vendafacil:prod
    exit 1
}

# Verificar se os seeds foram executados
Write-Host "🌱 Verificando execução dos seeds..." -ForegroundColor Yellow
try {
    docker exec vendafacil-prod-test ls -la /var/www/html/storage/.seeded | Out-Null
    Write-Host "✅ Seeds foram executados com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Seeds podem não ter sido executados" -ForegroundColor Yellow
}

# Parar container de teste
docker stop vendafacil-prod-test | Out-Null

# Limpar imagem de teste
docker rmi vendafacil:prod | Out-Null

Write-Host "✅ Testes de produção passaram!" -ForegroundColor Green

# Perguntar se deve continuar com o deploy
if (-not $Force) {
    $continue = Read-Host "🚀 Continuar com o deploy? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "❌ Deploy cancelado pelo usuário" -ForegroundColor Yellow
        exit 0
    }
}

# Adicionar mudanças ao Git
Write-Host "📝 Adicionando mudanças ao Git..." -ForegroundColor Yellow
git add .

# Verificar se há mudanças para commit
$changes = git diff --staged --name-only
if (-not $changes) {
    Write-Host "ℹ️ Nenhuma mudança para commit" -ForegroundColor Cyan
} else {
    # Commit das mudanças
    Write-Host "💾 Fazendo commit das mudanças..." -ForegroundColor Yellow
    if (-not $CommitMessage) {
        $CommitMessage = Read-Host "Digite a mensagem do commit"
        if (-not $CommitMessage) {
            $CommitMessage = "Deploy: configuração HTTPS e seeds para produção"
        }
    }
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro no commit" -ForegroundColor Red
        exit 1
    }
}

# Push para o repositório
Write-Host "🚀 Fazendo push para o repositório..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no push" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deploy para produção concluído!" -ForegroundColor Green
Write-Host "🌐 Acesse: https://dashboard.render.com para acompanhar o progresso" -ForegroundColor Cyan
Write-Host "📱 URL da aplicação: https://vendafacil.onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Configurações aplicadas:" -ForegroundColor Yellow
Write-Host "   ✓ HTTPS forçado em produção" -ForegroundColor Green
Write-Host "   ✓ Seeds executados automaticamente" -ForegroundColor Green
Write-Host "   ✓ Headers de segurança configurados" -ForegroundColor Green
Write-Host "   ✓ Cache otimizado para assets" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Para forçar re-execução dos seeds, defina FORCE_SEED=true no Render.com" -ForegroundColor Cyan
