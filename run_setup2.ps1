$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Write-Host "Downloading VCRedist 2015-2022..."
Invoke-WebRequest -Uri "https://aka.ms/vs/17/release/vc_redist.x64.exe" -OutFile "vc_redist.x64.exe"

Write-Host "Installing VCRedist silently..."
Start-Process -FilePath ".\vc_redist.x64.exe" -ArgumentList "/install", "/passive", "/norestart" -Wait

Write-Host "Configuring PHP..."
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
