param(
  [string]$RootPath = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = $(if ($env:PORT) { [int]$env:PORT } else { 8765 })
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $RootPath on http://localhost:$Port/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css"
  ".js"   = "application/javascript"
  ".json" = "application/json"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  try {
    $urlPath = [System.Uri]::UnescapeDataString($req.Url.LocalPath)
    if ($urlPath -eq "/") { $urlPath = "/index.html" }
    $filePath = Join-Path $RootPath ($urlPath.TrimStart("/"))

    # Pretty URLs: "/tarjetas-nfc" -> "/tarjetas-nfc.html" (mirrors the .htaccess rewrite rule)
    if (-not (Test-Path $filePath -PathType Leaf) -and -not (Test-Path $filePath -PathType Container)) {
      $htmlCandidate = "$filePath.html"
      if (Test-Path $htmlCandidate -PathType Leaf) { $filePath = $htmlCandidate }
    }

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $ct = $mime[$ext]
      if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $res.ContentType = $ct
      $res.StatusCode = 200
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
