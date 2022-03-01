# レジストリにあるUninstallStringを探す関数
function Get-TargetApplicationRegistry ([string]$appName, [string[]]$uninstallKeys) {
  foreach ($uninstallKey in $uninstallKeys) {
    #Write-Host $uninstallRegKey;
    $uninstallAppKeyNames = (Get-ChildItem -Path $uninstallKey -Name);
    
    foreach ($uninstallAppKeyName in $uninstallAppKeyNames) {
      $uninstallAppKey = $uninstallKey + "\" + $uninstallAppKeyName; 
      $appProperties = Get-ItemProperty $uninstallAppKey;
      if ($appProperties.displayName -eq $appName) {   
        Write-Host $displayName;
        $uninstallString = $appProperties.UninstallString;
        return $uninstallString;
      }
    }
  }
  return "nothing";
}

# MSIファイルを実行する関数
function execMSI([string]$appCode) {
  return ( `
      Start-Process `
      -FilePath "msiexec.exe" `
      -ArgumentList "/X $appCode" `
      -Wait `
      -Passthru `
  ).ExitCode
}

# 削除するアプリ名
$appNames = @(
  "アプリ１",
  "アプリ２",
  "アプリ３"
);

# 探すレジストリキー
$uninstallKeys = @(
  "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
  "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
  "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\"
);

# メイン
foreach ($appName in $appNames) {
  Write-Host $appName;
  $uninstallString = Get-TargetApplicationRegistry $appName $uninstallKeys;
  if ($uninstallString -ne "nothing" ) {
    $appCode = $uninstallString.Replace("MsiExec.exe /X", "");
    $exitCode = execMSI $appCode;
    # Write-Host $exitCode;
    if ($exitCode -eq 0) {
      Write-Host "アンインストールが完了しました";
    }
    elseif ($exitCode -eq 1602) {
      Write-Host "アンインストールがキャンセルされました";
    }
  }
  else {
    Write-Host "アンインストール済みです";
  }
}
