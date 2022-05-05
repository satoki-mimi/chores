# アプリをアンインストールするためのIdentifyingNumberを探す関数
function getIdentifyingNumber ([string]$appName) {
    # Uninstallから探す
    $uninstallKeys = @(
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
        "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall"
    );
    foreach ($uninstallKey in $uninstallKeys) {
        $uninstallAppKeyNames = (Get-ChildItem -Path $uninstallKey -Name);
        foreach ($uninstallAppKeyName in $uninstallAppKeyNames) {
            $appProperties = Get-ItemProperty ($uninstallKey + "\" + $uninstallAppKeyName);
            if ($appProperties.displayName -eq $appName) {   
                return ($appProperties.UninstallString).Replace("MsiExec.exe /X", "");
            }
        }
    }
    # Win32_Productから探す（注意：アンインストールするためのIdentifyingNumberではない）
    $product = Get-WmiObject -class Win32_Product -Filter "name = '$appName'";
    if ($product) { return $product.IdentifyingNumber }
    # 製品情報から探す
    $productsKey = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\UserData\S-1-5-18\Products";
    $installPropKeyNames = (Get-ChildItem -Path $productsKey -Name);
    foreach ($installPropKeyName in $installPropKeyNames) {
        $appProperties = Get-ItemProperty -Path ($productsKey + "\" + $installPropKeyName + "\InstallProperties");
        if ($appProperties.displayName -eq $appName) {
            return ($appProperties.UninstallString).Replace("MsiExec.exe /X", "");
        }
    }
    # 見つからない場合
    return "none";
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
    "appName1",
    "appName2",
    "appName3"
);

# メイン
foreach ($appName in $appNames) {
    Write-Host "--------------------------------------";
    Write-Host $appName;
    $identifyingNumber = getIdentifyingNumber $appName;
    if ($identifyingNumber -ne "none" ) {
        $exitCode = execMSI $identifyingNumber;
        # Write-Host $exitCode;
        if ($exitCode -eq 0) { Write-Host "アンインストールが完了しました"; }
        elseif ($exitCode -eq 1602) { Write-Host "アンインストールがキャンセルされました"; }
        else { Write-Host "アンインストールに失敗した可能性があります" }
    }
    else { Write-Host "アンインストール済みです"; }
}
