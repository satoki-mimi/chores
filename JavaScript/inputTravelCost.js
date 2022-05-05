const keihimeisai = {
    startDay: 'yyyy, mm, dd',
    endDay: 'yyyy, mm, dd',
    from: '乗車駅',
    to: '降車駅',
    kingaku: '999',
    hakkousya: '',
    bikou: ''
    // himoku: '旅費交通費',
    // ouhuku: 'yes',
}

// 日付のフォーマット
function getYMD(theDay) {
    let y = theDay.getFullYear();
    let m = ("00" + (theDay.getMonth() + 1)).slice(-2);
    let d = ("00" + theDay.getDate()).slice(-2);
    let ymd = y + "/" + m + "/" + d;
    return ymd;
}

let startDay = new Date(keihimeisai.startDay);
let endDay = new Date(keihimeisai.endDay);
let theDay = startDay;
theDay.setDate(theDay.getDate() - 1);

let term = setInterval(() => {
    theDay.setDate(theDay.getDate() + 1);
    if (theDay > endDay) {
        clearInterval(term);
    } else {
        if (0 < theDay.getDay() && theDay.getDay() < 6) { // 平日
            document.getElementById('DlgDetailDate').value = getYMD(theDay);
            // document.getElementById('DlgDetailExpItem').options[getOptionNumber(keihimeisai.himoku)].selected = true;
            document.getElementById('DlgExpDetailStFrom').value = keihimeisai.from;
            document.getElementById('DlgExpDetailStTo').value = keihimeisai.to;
            // is_ouhuku(keihimeisai.ouhuku);
            document.getElementById('DlgDetailCost').value = keihimeisai.kingaku;
            document.getElementById('DlgDetailPublisher').value = keihimeisai.hakkousya;
            document.getElementById('DlgDetailDetail').textContent = keihimeisai.bikou;
            document.querySelector("div.ts-dialog-buttons > div.ts-edge-continue > button").click();
        }
    }
}, 100);

/*
// 費目のオプション選択
function getOptionNumber(himoku) {
    const options = document.getElementById('DlgDetailExpItem').options
    for (let i = 1; i < options.length; i++) {
        if (options[i].textContent == himoku) {
            return i;
        }
    }
    return 0;
}

// 往復か否か
function is_ouhuku(ouhuku) {
    let target = document.getElementsByClassName('pp_base ts-form-roundtrip pp_btn_round');
    if (target.length == 0) {
        target = document.getElementsByClassName('pp_base pp_btn_oneway ts-form-roundtrip');
    }
    if (ouhuku == 'yes' || ouhuku == 'y') {
        target.className = 'pp_base ts-form-roundtrip pp_btn_round';
    } else {
        target.className = 'pp_base pp_btn_oneway ts-form-roundtrip';
    }
}
*/
