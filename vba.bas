'連番を省略する関数
'①1,2,3,4,6,7,9,10,11,13
'②1-2-3-4,6-7,9-10-11,13　（連続ならハイフン、連続でないならカンマで連結）
'③1-2-3-4,6,7,9-10-11,13　（２連続ならハイフンはカンマに置換）
'④1---4,6,7,9--11,13　（ハイフンに挟まれた文字はハイフンに置換）
'⑤1~4,6,7,9~11,13　（連続したハイフンはチルダに置換）
Function omitNum(arr)
    Dim str As String
    str = ""
    For i = 0 To UBound(arr) - 1
        '連番ならハイフンで連結②
        If val(arr(i)) + 1 = val(arr(i + 1)) Then
            str = str + arr(i) + "-"
        '連番でないならカンマで連結②
        Else
            str = str + arr(i) + ","
        End If
    Next i
    str = str + arr(UBound(arr))
    str = replaceStr(str, "(,\d{1,})-(\d{1,},)", "$1,$2") '③
    str = replaceStr(str, "-\d{1,}-", "-") '④
    str = replaceStr(str, "-+", "~") '⑤
    ' ３桁区切り表示とされないように、カンマを読点に変更する
    str = Replace(str, ",", "、", 1, -1)
    omitNum = str
End Function


'正規表現で文字列を置換する関数
'str = "1-2-3-4,6-7,9-10-11,13-14,16,17"
Function replaceStr(str, pattern, alt)
    Dim endFlag As Boolean
    Dim tmpStr As String
    Dim re As Object
    Set re = CreateObject("VBScript.RegExp")
    endFlag = False
    
    Do While endFlag = False
        re.pattern = pattern
        re.Global = True
        re.IgnoreCase = True
        tmpStr = str
        str = re.Replace(str, alt)
        If tmpStr = str Then
            endFlag = True
        End If
    Loop
    replaceStr = tmpStr
End Function


'バブルソート
Function bubbleSort(arr)
    Dim tmp As Variant
    Dim i, j As Integer
    For i = 0 To UBound(arr) - 1
        For j = 0 To UBound(arr) - 1
            If Val(arr(j)) > Val(arr(j + 1)) Then
                tmp = arr(j)
                arr(j) = arr(j + 1)
                arr(j + 1) = tmp
            End If
        Next j
    Next i
    bubbleSort = arr
End Function
