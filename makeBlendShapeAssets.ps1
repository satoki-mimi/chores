$UTF8NoBomEnc = New-Object System.Text.UTF8Encoding $False

$outputDir = "E:\Repositories\chores\output"
$initial_index = 26
$parentFileID = 11500000
$childFileID = 11400000
$parentGUID = "37562b39ff933b245ac2f35d87edbcd6"

$names = @(
  'BrowDownLeft',
  'BrowDownRight',
  'BrowInnerUp',
  'BrowOuterUpLeft',
  'BrowOuterUpRight',
  'CheekPuff',
  'CheekSquintLeft',
  'CheekSquintRight',
  'EyeBlinkLeft',
  'EyeBlinkRight',
  'EyeLookDownLeft',
  'EyeLookDownRight',
  'EyeLookInLeft',
  'EyeLookInRight',
  'EyeLookOutLeft',
  'EyeLookOutRight',
  'EyeLookUpLeft',
  'EyeLookUpRight',
  'EyeSquintLeft',
  'EyeSquintRight',
  'EyeWideLeft',
  'EyeWideRight',
  'JawForward',
  'JawLeft',
  'JawOpen',
  'JawRight',
  'MouthClose',
  'MouthDimpleLeft',
  'MouthDimpleRight',
  'MouthFrownLeft',
  'MouthFrownRight',
  'MouthFunnel',
  'MouthLeft',
  'MouthLowerDownLeft',
  'MouthLowerDownRight',
  'MouthPressLeft',
  'MouthPressRight',
  'MouthPucker',
  'MouthRight',
  'MouthRollLower',
  'MouthRollUpper',
  'MouthShrugLower',
  'MouthShrugUpper',
  'MouthSmileLeft',
  'MouthSmileRight',
  'MouthStretchLeft',
  'MouthStretchRight',
  'MouthUpperUpLeft',
  'MouthUpperUpRight',
  'NoseSneerLeft',
  'NoseSneerRight',
  'TongueOut'  
)

for ($i = 0; $i -lt $names.Count; $i++) {
  #assetファイル
  $val1 = @"
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!114 &11400000
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: 0}
  m_Enabled: 1
  m_EditorHideFlags: 0
"@
  $val2 = "  m_Script: {fileID: " + $parentFileID + ", guid: " + $parentGUID + ", type: 3}"
  $val3 = "  m_Name: " + $names[$i]
  $val4 = @"
  m_EditorClassIdentifier: 
  m_prefab: {fileID: 0}
"@
  $val5 = "  BlendShapeName: " + $names[$i]
  $val6 = @"
  Preset: 0
  Values:
  - RelativePath: Mesh_Head
"@
  $val7 = "    Index: " + ($initial_index + $i)
  $val8 = @"
    Weight: 100
  MaterialValues: []
  IsBinary: 0
"@
  $val = $val1 + "`r`n" + $val2 + "`r`n" + $val3 + "`r`n" + $val4 + "`r`n" + $val5 + "`r`n" + $val6 + "`r`n" + $val7 + "`r`n" + $val8
  $filePath = $outputDir + "\" + $names[$i] + ".asset"
  [System.IO.File]::WriteAllLines($filePath, $val, $UTF8NoBomEnc)

  # metaファイル
  $guid1 = -Join (Get-Random -Count 16 -input 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f)
  $guid2 = -Join (Get-Random -Count 16 -input 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f)
  $guid = $guid1 + $guid2
  $val1 = "fileFormatVersion: 2"
  $val2 = "guid: " + $guid
  $val3 = @"
NativeFormatImporter:
  externalObjects: {}
"@
  $val4 = "  mainObjectFileID: " + $fileID
  $val5 = @"
  userData: 
  assetBundleName: 
  assetBundleVariant: 
"@
  $val = $val1 + "`r`n" + $val2 + "`r`n" + $val3 + "`r`n" + $val4 + "`r`n" + $val5
  $filePath = $outputDir + "\" + $names[$i] + ".asset.meta"
  [System.IO.File]::WriteAllLines($filePath, $val, $UTF8NoBomEnc)

  # BlendShape.assetに追記するテキスト
  $value = "  - {fileID: " + $childFileID + ", guid: " + $guid + ", type: 2}"
  $filePath = $outputDir + "\appendBlendShape.txt"
  Write-Output $value | Add-Content $filePath
}