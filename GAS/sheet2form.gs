function sheet2form() {

  //配列からキーワードに一致する要素のインデックスを返す
  function findIndex(values, keyword) {
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] == keyword) { //1列目のみ
        return i + 1;
      }
    }
  }

  //シート全体を二次元配列に格納する
  const sheet = SpreadsheetApp.getActive().getActiveSheet();
  let values = sheet.getDataRange().getValues();

  //「_FORM」、「_BEGIN」、「_END」のセルを探す
  const formNum = findIndex(values, "_FORM");
  const beginNum = findIndex(values, "_BEGIN");
  const endNum = findIndex(values, "_END");

  //フォームファイル作成
  let date = new Date();
  let fileName = 'フォーム_' //ファイル名が未指定の場合のための初期値
    + date.getFullYear()
    + ('0' + (date.getMonth() + 1)).slice(-2)
    + ('0' + date.getDate()).slice(-2) + "_"
    + ('0' + date.getHours()).slice(-2)
    + ('0' + date.getMinutes()).slice(-2)
    + ('0' + date.getSeconds()).slice(-2);
  let form = FormApp.create(fileName);
  const formID = form.getId();

  //フォームの設定を読み込む
  for (let i = formNum; i < beginNum - 1; i++) {
    let method = values[i][1];

    if (method == "フォームファイル名") {
      DriveApp.getFileById(formID).setName(values[i][3])
    }
    else if (method == "フォームタイトル") {
      form
        .setTitle(values[i][3])
        .setDescription(values[i][4]);
    }
    else if (!method) {
      //空行なら何もしない
    }
    else {
      Browser.msgBox(method + "：不明なメソッドです。");
    }
  }

  //フォームの内容を読み込む
  for (let i = beginNum; i < endNum - 1; i++) {
    let method = values[i][1];

    //セクションを追加するか否か
    let section;
    if (values[i][0] == "次のセクション") {
      section = form.addPageBreakItem();
    };

    if (method == "セクションタイトル") {
      section
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (method == "タイトル") {
      let item = form.addSectionHeaderItem();
      item
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (method == "記述式") {
      let item = form.addTextItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (method == "段落") {
      let item = form.addParagraphTextItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (method == "ラジオボタン") {
      let item = form.addMultipleChoiceItem();
      let list = [];
      for (let j = 6; j < 2006; j++) { //選択数の上限は2000個
        let value = values[i][j];
        if (value) {
          list.push(values[i][j]);
        } else {
          continue;
        }
      }
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        .setChoiceValues(list).showOtherOption(values[i][5] == "その他あり")
        ;
    }
    else if (method == "チェックボックス") {
      let item = form.addCheckboxItem();
      let list = [];
      for (let j = 6; j < 2006; j++) { //選択数の上限は2000個
        let value = values[i][j];
        if (value) {
          list.push(values[i][j]);
        } else {
          continue;
        }
      }
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        .setChoiceValues(list).showOtherOption(values[i][5] == "その他あり");
      ;
    }
    else if (method == "プルダウン") {
      let item = form.addListItem();
      let list = [];
      for (let j = 5; j < 2005; j++) { //選択数の上限は2000個
        let value = values[i][j];
        if (value) {
          list.push(values[i][j]);
        } else {
          continue;
        }
      }
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        .setChoiceValues(list)
        ;
    }
    else if (method == "均等目盛") {
      var item = form.addScaleItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        .setBounds(values[i][5], values[i][6])
        .setLabels(values[i][7], values[i][8])
    }
    else if (method == "日付") {
      let item = form.addDateItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        .setIncludesYear(values[i][5] == "年を含む")
        ;
    }
    else if (method == "日付と時刻") {
      let item = form.addDateTimeItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (method == "時刻") {
      let item = form.addTimeItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (method == "持続時間") {
      let item = form.addDurationItem();
      item
        .setRequired(values[i][2] == "必須")
        .setTitle(values[i][3])
        .setHelpText(values[i][4])
        ;
    }
    else if (!method) {
      //空行なら何もしない
    }
    else {
      Browser.msgBox(method + "：不明なメソッドです");
    }

  }

}
