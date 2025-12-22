$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$env:TMP  = Join-Path $projectRoot "storage/temp"
$env:TEMP = $env:TMP
if (-not (Test-Path $env:TMP)) {
    New-Item -ItemType Directory -Path $env:TMP -Force | Out-Null
}
Write-Host "TMP set to $env:TMP" -ForegroundColor Green
php -d upload_tmp_dir="$env:TMP" -d sys_temp_dir="$env:TMP" artisan serve
