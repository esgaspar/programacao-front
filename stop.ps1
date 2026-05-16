$input = Read-Host "Porta (Enter para 4200)"
$port = if ($input -match '^\d+$') { [int]$input } else { 4200 }

$conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force
    Write-Host "Porta $port encerrada (PID $($conn.OwningProcess))."
} else {
    Write-Host "Nenhum processo rodando na porta $port."
}
