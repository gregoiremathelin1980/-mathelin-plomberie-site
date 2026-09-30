$urls = @(
  "https://www.mathelin-plomberie.fr/",
  "https://www.plombier-meximieux.fr/",
  "https://www.plombier-amberieu.fr/"
)

foreach ($url in $urls) {
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    $ms = $sw.ElapsedMilliseconds
    $code = $r.StatusCode
    $size = $r.Content.Length
    $cache = if ($r.Headers["x-vercel-cache"]) { $r.Headers["x-vercel-cache"] } else { "n/a" }
    Write-Host "$url => HTTP $code | ${ms}ms | ${size} chars | Vercel-Cache: $cache"
  } catch {
    $sw.Stop()
    Write-Host "$url => ERREUR apres $($sw.ElapsedMilliseconds)ms : $($_.Exception.Message)"
  }
}
