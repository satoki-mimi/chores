const score = document.getElementById("score");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const canvasSize = { x: 400, y: 200 };
canvas.width = canvasSize.x;
canvas.height = canvasSize.y;

function playGame() {

    const dt = 10; //経過時間（描画の時間間隔）[ms]、setInterval関数で使用する
    const v = 0.1; //ボールの速さ[px/ms]
    const ballRadius = 20; //ボールの半径[px]
    const ballNum = 8; //ボールの個数

    // スコアを表示する
    score.textContent = "スコア: 0/" + ballNum;

    // ボールがキャンバスをはみ出さないようにフィールドをボールの直径分だけ狭める
    // キャンバスに描画する際はボールの半径分だけ右下にずらす必要がある
    canvasSize.x = canvasSize.x - 2 * ballRadius;
    canvasSize.y = canvasSize.y - 2 * ballRadius;

    // 各ボールの初期位置と速度
    const balls = []; //ボールによって位置と速度がそれぞれ異なるため、配列を用意して記憶するようにしておく
    for (let i = 0; i < ballNum; i++) {
        balls.push({
            x: canvasSize.x * Math.random(), //最小単位が1pxなので、Math.floorを使用して少数を切り捨てても良いが
            y: canvasSize.y * Math.random(), //切り捨てなくても、結局はブラウザが切り捨てて描画する
            vx: v * Math.random(), //ゲーム性を高めるために、ボールごとに初期速度を変える
            vy: v * Math.random()
        });
    }

    const drawImage = function () {
        // キャンバスの内容をクリアする
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 物理演算
        for (let i = 0; i < balls.length; i++) { //ボールごとに計算する
            // 可読性を高めるために一旦配列から取り出して分かりやすい変数に入れる
            let x = balls[i].x;
            let y = balls[i].y;
            let vx = balls[i].vx;
            let vy = balls[i].vy;

            x = x + vx * dt; // 位置 = 位置 + 速度 x 経過時間
            y = y + vy * dt;

            if (x < 0) { //ボールがフィールドの左にはみ出した時
                x = -x; //フィールド内に戻す
                vx = -vx; //進む向きを反転させる
            }
            if (x > canvasSize.x) { //ボールがフィールドの右にはみ出した時
                x = canvasSize.x - (x - canvasSize.x);
                vx = -vx;
            }
            if (y < 0) { ////ボールがフィールドの上にはみ出し時
                y = -y;
                vy = -vy;
            }
            if (y > canvasSize.y) { //ボールがフィールドの下にはみ出した時
                y = canvasSize.y - (y - canvasSize.y);
                vy = -vy;
            }

            // 上で計算した結果を配列に戻す（反映させる）
            balls[i].x = x;
            balls[i].y = y;
            balls[i].vx = vx;
            balls[i].vy = vy;

            // 描画
            context.beginPath();
            context.arc(
                balls[i].x + ballRadius, //ボールの半径分だけ右にずらす
                balls[i].y + ballRadius, //ボールの半径分だけ下にずらす
                ballRadius,
                0, 2 * Math.PI,
                false
            );
            context.closePath();
            context.fillStyle = "black";
            context.fill();
        }
    }

    // コマ送り
    const timer = setInterval(drawImage, dt)

    // ボールをクリックしたときのイベント
    canvas.addEventListener("click", e => {
        const rect = canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        // ボールごとに計算する
        for (let i = 0; i < balls.length; i++) {
            // 可読性を高めるために一旦配列から取り出して分かりやすい変数に入れる
            let x1 = balls[i].x;
            let y1 = balls[i].y;
            let x2 = point.x - ballRadius;
            let y2 = point.y - ballRadius;
            // 2点間の距離は右の式で求められる。 √ ( (x2-x1)^2)+(y2-y1)^2 )
            let l = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            // 2点間の距離がボールの半径より小さいとき
            if (l < ballRadius) {
                balls.splice(i, 1); //配列からボールを削除する。次の描画の時には消える
                // 配列からボールが全て削除されたとき
                if (balls.length <= 0) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    alert("CLEAR");
                    clearInterval(timer); //コマ送りを止める
                }
                // 得点を更新する
                score.textContent = "スコア: " + (ballNum - balls.length) + "/" + ballNum;
                break;
            }
        }
    });

    drawImage();
}

playGame();