# compress_pet_images.ps1 — 压缩超限图片到 200KB 以下
Add-Type -AssemblyName System.Drawing

$dest = 'G:\xiaocx\今天吃什么\assets\pet'
$tmp  = 'G:\xiaocx\temp_pet_compress'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

Write-Host "=== 压缩前 ==="
Get-ChildItem $dest -Filter 'pet_*.png' | ForEach-Object {
    $kb = [math]::Round($_.Length/1KB, 1)
    $flag = if ($_.Length -gt 200KB) { ' [超限!]' } else { '' }
    Write-Host "  $kb KB  $($_.Name)$flag"
}

$overLimit = Get-ChildItem $dest -Filter 'pet_*.png' | Where-Object { $_.Length -gt 200KB }

foreach ($f in $overLimit) {
    Write-Host "`n处理 $($f.Name)..." -NoNewline
    $srcPath = $f.FullName
    $tmpPath = Join-Path $tmp 'out.png'

    foreach ($size in @(384, 256, 192)) {
        $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        $small = New-Object System.Drawing.Bitmap($size, $size)
        $g = [System.Drawing.Graphics]::FromImage($small)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bmp, 0, 0, $size, $size)
        $g.Dispose()
        $bmp.Dispose()
        $small.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $small.Dispose()

        $sz = (Get-Item $tmpPath).Length
        $kb = [math]::Round($sz/1KB, 1)

        if ($sz -le 200KB) {
            Copy-Item $tmpPath -Destination $srcPath -Force
            Write-Host " ${size}x${size} = $kb KB OK" -ForegroundColor Green
            break
        }
        if ($size -eq 192) {
            Copy-Item $tmpPath -Destination $srcPath -Force
            Write-Host " ${size}x${size} = $kb KB (仍超限，最小化)" -ForegroundColor Yellow
        }
    }
}

Remove-Item $tmp -Recurse -Force

Write-Host "`n=== 压缩后 ==="
Get-ChildItem $dest -Filter 'pet_*.png' | ForEach-Object {
    $kb = [math]::Round($_.Length/1KB, 1)
    $flag = if ($_.Length -gt 200KB) { ' [超限]' } else { ' OK' }
    Write-Host "  $kb KB  $($_.Name)$flag"
}
