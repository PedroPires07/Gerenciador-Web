# Script para remover arquivos sensíveis do histórico do Git
# ATENÇÃO: Execute este script com cuidado, pois ele reescreve o histórico do Git

Write-Host "⚠️  AVISO: Este script vai remover arquivos sensíveis do histórico do Git" -ForegroundColor Yellow
Write-Host "Isso vai reescrever o histórico do repositório." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Deseja continuar? (digite 'SIM' para confirmar)"

if ($confirm -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Removendo arquivos sensíveis do histórico..." -ForegroundColor Cyan

# Remove .env.local do histórico
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch .env.local" `
  --prune-empty --tag-name-filter cat -- --all

# Remove serviceAccountKey.json do histórico
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch serviceAccountKey.json" `
  --prune-empty --tag-name-filter cat -- --all

Write-Host ""
Write-Host "✓ Arquivos removidos do histórico" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: git push origin --force --all" -ForegroundColor White
Write-Host "2. Execute: git push origin --force --tags" -ForegroundColor White
Write-Host "3. Notifique sua equipe para fazer 'git pull --rebase'" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Todos os colaboradores devem clonar o repositório novamente ou fazer rebase" -ForegroundColor Red
