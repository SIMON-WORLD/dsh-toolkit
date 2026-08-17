# dsh-doctor — DeepSeek Harness 环境体检（Windows PowerShell 版）
# 痛点依据：#649 / #1719 / #293 / #107 / #589 / #139
# 用法: powershell -ExecutionPolicy Bypass -File dsh-doctor.ps1

$ErrorActionPreference = 'SilentlyContinue'
$pass = 0; $warn = 0

function Check($name, $ok, $detail, $fix) {
  if ($ok) { $script:pass++; Write-Host "[OK]   $name : $detail" -ForegroundColor Green }
  else { $script:warn++; Write-Host "[WARN] $name : $detail" -ForegroundColor Yellow; if ($fix) { Write-Host "       -> 修复: $fix" -ForegroundColor Cyan } }
}

Write-Host "`n[dsh-doctor] DeepSeek Harness 环境体检 (Windows)" -ForegroundColor Magenta
Write-Host ("-" * 40)

# 1. Node 版本
$nv = node -v
if ($nv -match '^v(\d+)\.(\d+)') {
  $ok = ([int]$Matches[1] -gt 22) -or ([int]$Matches[1] -eq 22 -and [int]$Matches[2] -ge 19)
  Check "Node 版本" $ok $nv "安装 Node 22.19+ (dsh 硬性要求)"
} else { Check "Node 版本" $false "未检测到 node" "安装 Node 22.19+: https://nodejs.org/" }

# 2. koffi 版本（3.1.3/3.1.4 损坏）
$koffi = npm ls koffi --depth=0 2>$null | Select-String 'koffi@'
if ($koffi) {
  $ver = $koffi.ToString().Trim() -replace '.*koffi@',''
  Check "koffi 版本" ($ver -eq '3.1.2') $ver "npm i koffi@3.1.2 (3.1.3/3.1.4 预编译损坏)"
} else { Check "koffi" $true "未安装(如需目录选择器请装并锁 3.1.2)" }

# 3. 端口 3080（Hyper-V 保留区间）
$port = netstat -ano | Select-String ':3080'
Check "端口 3080" (-not $port) $(if ($port) { "被占用" } else { "空闲" }) "dsh web --port 13080 (3070-3169 是 Hyper-V 保留区间)"

# 4. 工作区路径字符（中文路径截断 bug）
$cwd = (Get-Location).Path
Check "工作区路径字符" ($cwd -match '^[\x20-\x7E:]+$') $cwd "改用纯 ASCII 路径"

# 5. DSH_HOME
$home2 = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME '.dsh' }
Check "DSH_HOME" (Test-Path $home2) $(if ($env:DSH_HOME) { $home2 } else { "默认 $home2" }) "设置 DSH_HOME 环境变量"

# 6. 沙箱临时目录
$tmp = Join-Path $env:TEMP ("dsh-test-" + [guid]::NewGuid().ToString("N"))
try { New-Item -ItemType Directory -Path $tmp -Force | Out-Null; Remove-Item $tmp -Force; Check "沙箱临时目录" $true "可写" } catch { Check "沙箱临时目录" $false $_.Exception.Message "清理沙箱缓存后重启 dsh" }

# 7. 全局 git hooksPath
$hooks = git config --global --get core.hooksPath 2>$null
Check "全局 git hooksPath" (-not $hooks) $(if ($hooks) { $hooks } else { "未设置" }) "git config --global --unset core.hooksPath"

Write-Host ("-" * 40)
Write-Host "完成: $pass/$($pass+$warn) 项通过, $warn 项需处理" -ForegroundColor $(if ($warn) { "Yellow" } else { "Green" })
