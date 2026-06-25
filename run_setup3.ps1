$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Write-Host "Downloading fresh PHP 8.3.11..."
Invoke-WebRequest -Uri "https://windows.php.net/downloads/releases/php-8.3.11-nts-Win32-vs16-x64.zip" -OutFile "php83_fresh.zip"

Write-Host "Removing old PHP..."
Remove-Item -Recurse -Force php -ErrorAction SilentlyContinue

Write-Host "Extracting PHP 8.3.11..."
Expand-Archive -Path "php83_fresh.zip" -DestinationPath "php" -Force

Write-Host "Configuring PHP..."
Copy-Item "php\php.ini-development" "php\php.ini"
$ini = Get-Content "php\php.ini"
$ini = $ini -replace ';extension=mbstring', 'extension=mbstring'
$ini = $ini -replace ';extension=openssl', 'extension=openssl'
$ini = $ini -replace ';extension=pdo_mysql', 'extension=pdo_mysql'
$ini = $ini -replace ';extension=fileinfo', 'extension=fileinfo'
$ini = $ini -replace ';extension=curl', 'extension=curl'
$ini = $ini -replace ';extension=sqlite3', 'extension=sqlite3'
$ini = $ini -replace ';extension=pdo_sqlite', 'extension=pdo_sqlite'
$ini | Set-Content "php\php.ini"

$env:PATH = "$PWD\php;" + $env:PATH
php -v

Write-Host "Creating Laravel 13 project..."
.\composer.bat create-project laravel/laravel:^13.0 insan-apu-backend

if (Test-Path "insan-apu-backend") {
    Write-Host "Restoring scaffold files..."
    Copy-Item -Path "insan-apu-scaffold\routes\api.php" -Destination "insan-apu-backend\routes\api.php" -Force
    Copy-Item -Path "insan-apu-scaffold\app\Http\Controllers\Api" -Destination "insan-apu-backend\app\Http\Controllers\" -Recurse -Force
    Copy-Item -Path "insan-apu-scaffold\app\Models\Pegawai.php" -Destination "insan-apu-backend\app\Models\Pegawai.php" -Force
    Copy-Item -Path "insan-apu-scaffold\database\migrations\*" -Destination "insan-apu-backend\database\migrations\" -Force
}

Write-Host "Setup Complete!"
