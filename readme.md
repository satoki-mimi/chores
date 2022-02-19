# スクリプトの掃きだめ
リポジトリを分ける必要がないくらいのものを置いておく。  
javaScript（フロントエンド）の場合は、全てhtmlファイルに組み込んでいる。

## bouncingBalls.html
canvasでボールがバウンドする。クリックすると消える。  
なぜか職場の同僚から作ってほしいと言われたので作成した。コメントが無駄に多い。  
![img](https://user-images.githubusercontent.com/79532972/151468147-143a9d15-c4a1-42bd-b2da-4bcc10f6b869.png)

## colorPalette.html
colorMapsHSV.html / colorMapsHSL.html  
Unityでマテリアル数を削減するために、カラーマップ（パレット）を作成した。  
UV1にこのカラーマップを充てて、UV2にノーマルマップを充てる。  
![img](https://user-images.githubusercontent.com/79532972/151468713-3a89e4dc-365b-405b-b3ea-0f62f9fa1b9e.png)

## inputTravelCost.js
交通費の申請が面倒だったので作成した。

## makeBlendShapeAssets.ps1
UnityのARKitBlendShapeLocationに従って、AvatorにBlendShapeClipを追加する。  
3Dモデルをパーフェクトシンクに対応させるために作成した。

## renameBones.py
Blenderが左右対称であることを認識できるように、VRoidモデルのボーンの名前を変更する。
