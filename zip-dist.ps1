Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = "c:\Users\Dell\Desktop\MyWork\myCV\dist.zip"
$distDir = "c:\Users\Dell\Desktop\MyWork\myCV\dist"

if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

Get-ChildItem -Path $distDir -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $full = $_.FullName
    $rel = $full.Substring($distDir.Length + 1).Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $full, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
}

$zip.Dispose()
Write-Host "SUCCESS: dist.zip created with forward slashes."
