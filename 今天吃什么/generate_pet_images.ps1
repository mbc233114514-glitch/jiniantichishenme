# generate_pet_images.ps1 — 下载到英文临时目录再复制
$ErrorActionPreference = 'Continue'

# 临时英文目录
$tmpDir = 'G:\xiaocx\temp_pet'
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

# 目标中文目录（用 $PSScriptRoot 避免硬编码）
$destDir = Join-Path $PSScriptRoot 'assets\pet'
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

Write-Host "Temp: $tmpDir"
Write-Host "Dest: $destDir"

$defs = @(
    @{ name='pet_excited.png'; prompt='cute kawaii cartoon pig light pink standing upright big black eyes pink nose open smiling excited clean flat illustration white background 512x512' },
    @{ name='pet_happy.png';   prompt='cute kawaii cartoon pig light pink standing upright big black eyes pink nose big open smile heart floating joyful expression clean flat illustration white background 512x512' },
    @{ name='pet_hungry.png';  prompt='cute kawaii cartoon pig light pink standing upright big black eyes pink nose thought bubble with drumstick sad hungry expression clean flat illustration white background 512x512' },
    @{ name='pet_bored.png';   prompt='cute kawaii cartoon pig light pink standing upright half closed sleepy eyes pink nose droopy mouth dull bored expression clean flat illustration white background 512x512' },
    @{ name='pet_dirty.png';   prompt='cute kawaii cartoon pig light pink standing upright brown mud splatters all over body black eyes pink nose unhappy expression clean flat illustration white background 512x512' },
    @{ name='pet_sleeping.png'; prompt='cute kawaii cartoon pig light pink lying down curled up closed eyes sleeping peacefully pink nose ZZZ letters floating clean flat illustration white background 512x512' }
)

$apiBase = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

foreach ($d in $defs) {
    Write-Host "`n$($d.name)" -NoNewline
    $enc = [System.Uri]::EscapeDataString($d.prompt)
    $url = "$apiBase?prompt=$enc&image_size=square_hd"
    $tmp = Join-Path $tmpDir $d.name
    try {
        Invoke-WebRequest -Uri $url -OutFile $tmp -UseBasicParsing
        $sz = (Get-Item $tmp).Length
        if ($sz -gt 5000) {
            Write-Host " OK($sz)" -ForegroundColor Green
        } else {
            Write-Host " SMALL($sz)" -ForegroundColor Red
            Remove-Item $tmp -Force
            continue
        }
        # 复制到中文路径
        Copy-Item -Path $tmp -Destination $destDir -Force
    } catch {
        Write-Host " ERR" -ForegroundColor Red
    }
}

# 清理临时目录
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Final ===" -ForegroundColor Cyan
Get-ChildItem $destDir -Filter 'pet_*.png' | Select-Object Name, Length | Format-Table -AutoSize
