$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Write-Host "Downloading PHP..."
Invoke-WebRequest -Uri "https://downloads.php.net/~windows/releases/archives/php-8.5.7-nts-Win32-vs17-x64.zip" -OutFile "php.zip"

Write-Host "Extracting PHP..."
Expand-Archive -Path "php.zip" -DestinationPath "php" -Force
Remove-Item "php.zip"

Write-Host "Configuring PHP..."
Copy-Item "php\php.ini-development" "php\php.ini"
$ini = Get-Content "php\php.ini"
$ini = $ini -replace ';extension=mbstring', 'extension=mbstring'
$ini = $ini -replace ';extension=openssl', 'extension=openssl'
$ini = $ini -replace ';extension=pdo_mysql', 'extension=pdo_mysql'
$ini = $ini -replace ';extension=fileinfo', 'extension=fileinfo'
$ini = $ini -replace ';extension=curl', 'extension=curl'
# Laravel needs sqlite extension for default DB in Laravel 11
$ini = $ini -replace ';extension=sqlite3', 'extension=sqlite3'
$ini = $ini -replace ';extension=pdo_sqlite', 'extension=pdo_sqlite'
$ini | Set-Content "php\php.ini"

# Add PHP to session PATH
$env:PATH = "$PWD\php;" + $env:PATH

Write-Host "Downloading Composer..."
Invoke-WebRequest -Uri "https://getcomposer.org/composer.phar" -OutFile "composer.phar"
Set-Content -Path "composer.bat" -Value '@php "%~dp0composer.phar" %*'

if (Test-Path "insan-apu-backend") {
    Write-Host "Renaming existing scaffold..."
    Rename-Item -Path "insan-apu-backend" -NewName "insan-apu-scaffold"
}

Write-Host "Creating Laravel project..."
.\composer.bat create-project laravel/laravel:^13.0 insan-apu-backend

if (Test-Path "insan-apu-backend") {
    Write-Host "Restoring scaffold files..."
    Copy-Item -Path "insan-apu-scaffold\routes\api.php" -Destination "insan-apu-backend\routes\api.php" -Force
    Copy-Item -Path "insan-apu-scaffold\app\Http\Controllers\Api" -Destination "insan-apu-backend\app\Http\Controllers\" -Recurse -Force
    Copy-Item -Path "insan-apu-scaffold\app\Models\Pegawai.php" -Destination "insan-apu-backend\app\Models\Pegawai.php" -Force
    Copy-Item -Path "insan-apu-scaffold\database\migrations\*" -Destination "insan-apu-backend\database\migrations\" -Force
}

Write-Host "Setup Complete!"
