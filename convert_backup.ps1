# Get the latest backup file
$latestBackup = Get-ChildItem -Path ".\backup" -Filter "*.dump" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($null -eq $latestBackup) {
    Write-Host "No backup files found in the backup directory."
    exit 1
}

$outputFile = ".\backup\latest_backup.sql"
$backupFileName = $latestBackup.Name

Write-Host "Converting $backupFileName to SQL format..."

# Use pg_dump to create a plain SQL backup
$command = "docker exec postgres_db pg_dump -U vomo_admin --format=plain --clean --if-exists --no-owner --no-privileges vomo_production_managament"
Invoke-Expression $command | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Conversion complete. SQL file saved as: $outputFile" 