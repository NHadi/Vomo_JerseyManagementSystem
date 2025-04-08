# Load environment variables from .env file
$envFile = Join-Path $PSScriptRoot ".." ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1]
            $value = $matches[2]
            Set-Item -Path "Env:$key" -Value $value
        }
    }
}

# Database configuration from environment variables
$DB_NAME = $env:POSTGRES_DB
$DB_USER = $env:POSTGRES_USER
$DB_HOST = $env:POSTGRES_HOST
$BACKUP_DIR = "./backup"

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Function to display usage
function Show-Usage {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  ./db_backup.ps1 backup                      - Create a new backup"
    Write-Host "  ./db_backup.ps1 restore [target_database]   - Restore from latest backup"
    Write-Host "  ./db_backup.ps1 list                       - List available backups"
    Write-Host "  ./db_backup.ps1 create-test-db             - Create a test database"
    Write-Host "  ./db_backup.ps1 help                       - Show this help message"
}

# Function to create backup
function Create-Backup {
    Write-Host "Creating backup..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $BACKUP_FILE = "$BACKUP_DIR/db_backup_$timestamp.dump"
    
    # Create backup using pg_dump
    $result = docker exec postgres_db pg_dump -U $DB_USER -F c -b -v -f /tmp/backup.dump $DB_NAME
    if ($LASTEXITCODE -eq 0) {
        # Copy the backup file from container to host
        docker cp postgres_db:/tmp/backup.dump $BACKUP_FILE
        Write-Host "Backup created successfully: $BACKUP_FILE" -ForegroundColor Green
    } else {
        Write-Host "Backup failed!" -ForegroundColor Red
        exit 1
    }
}

# Function to create test database
function Create-TestDB {
    $TEST_DB_NAME = "vomo_test_restore"
    Write-Host "Creating test database '$TEST_DB_NAME'..." -ForegroundColor Yellow
    
    # Terminate existing connections
    $result = docker exec postgres_db psql -U $DB_USER postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$TEST_DB_NAME';"
    
    # Drop database if it exists
    $result = docker exec postgres_db psql -U $DB_USER postgres -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to drop existing test database!" -ForegroundColor Red
        exit 1
    }
    
    # Create new database
    $result = docker exec postgres_db psql -U $DB_USER postgres -c "CREATE DATABASE $TEST_DB_NAME;"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Test database created successfully!" -ForegroundColor Green
        Write-Host "You can now restore to this database using:" -ForegroundColor Yellow
        Write-Host "./db_backup.ps1 restore $TEST_DB_NAME" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to create test database!" -ForegroundColor Red
        exit 1
    }
}

# Function to restore from backup
function Restore-Backup {
    param (
        [string]$targetDB = $DB_NAME
    )
    
    Write-Host "Available backups:" -ForegroundColor Yellow
    Get-ChildItem -Path "$BACKUP_DIR/*.dump" | ForEach-Object {
        Write-Host $_.Name
    }
    
    Write-Host "`nEnter the backup file name to restore (or press Enter for latest):" -ForegroundColor Yellow
    $backup_file = Read-Host
    
    if ([string]::IsNullOrEmpty($backup_file)) {
        $backup_file = Get-ChildItem -Path "$BACKUP_DIR/*.dump" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($null -eq $backup_file) {
            Write-Host "No backup files found!" -ForegroundColor Red
            exit 1
        }
        $backup_file = $backup_file.FullName
    }
    
    if (-not (Test-Path $backup_file)) {
        Write-Host "Backup file not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Restoring to database: $targetDB" -ForegroundColor Yellow
    Write-Host "From backup: $backup_file" -ForegroundColor Yellow
    Write-Host "WARNING: This will overwrite the target database!" -ForegroundColor Red
    Write-Host "Are you sure? (y/N)"
    $confirm = Read-Host
    
    if ($confirm -match '^[Yy]$') {
        # Copy backup file to container
        docker cp $backup_file postgres_db:/tmp/restore.dump
        
        # Create uuid-ossp extension if it doesn't exist
        $result = docker exec postgres_db psql -U $DB_USER -d $targetDB -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
        
        # Restore the database without -c flag to avoid dropping objects
        $result = docker exec postgres_db pg_restore -U $DB_USER -d $targetDB /tmp/restore.dump
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Restore completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "Some errors occurred during restore, but the process completed." -ForegroundColor Yellow
            Write-Host "You may want to check the database to ensure all data was restored correctly." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Restore cancelled." -ForegroundColor Yellow
    }
}

# Function to list backups
function List-Backups {
    Write-Host "Available backups:" -ForegroundColor Yellow
    Get-ChildItem -Path "$BACKUP_DIR/*.dump" | ForEach-Object {
        Write-Host "$($_.Name) - $($_.LastWriteTime) - $([math]::Round($_.Length / 1KB, 2)) KB"
    }
}

# Main script logic
$command = $args[0]
$targetDB = $args[1]

switch ($command) {
    "backup" {
        Create-Backup
    }
    "restore" {
        Restore-Backup -targetDB $targetDB
    }
    "list" {
        List-Backups
    }
    "create-test-db" {
        Create-TestDB
    }
    { $_ -in @("help", "--help", "-h", "") -or $_ -eq $null } {
        Show-Usage
    }
    default {
        Write-Host "Invalid command!" -ForegroundColor Red
        Show-Usage
        exit 1
    }
} 