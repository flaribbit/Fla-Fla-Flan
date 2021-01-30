const wt = [-4, -3, -2, -1, 1, 2, 3, 4];
var game = new Vue({
    el: '#maingame',
    data: {
        data_tr: ["translate(-290 -102)", "translate(-230 -80)", "translate(-170 -58)", "translate(-110 -36)", "translate(110 -36)", "translate(170 -58)", "translate(230 -80)", "translate(290 -102)"],
        data_cl: ["red", "yellow", "green", "blue", "orange", "cyan", "purple", "black"],
        wing: [[], [], [], [], [], [], [], []],
        next: 0,
        current: 0,
        cursor: 0,
        score: 0,
        level: 0,
        colors: 6,
        balance: 0,
        acc: 0,
        vel: 0,
        angle: 0,
        startTime: 0,
        timer: 0,
    }
});

document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case "ArrowLeft": if (game.cursor > 0) game.cursor -= 1; break;
        case "ArrowRight": if (game.cursor < 7) game.cursor += 1; break;
        case "KeyZ": case "Space": append(); break;
        default: break;
    };
});

init();

function init() {
    var wing = [];
    for (var i = 0; i < 8; i++) {
        var col = [];
        for (var j = 0; j < 2; j++) {
            col.push(Math.floor(game.colors * Math.random()));
        }
        wing.push(col);
    }
    game.wing = wing;
    game.next = Math.floor(6 * Math.random());
    game.current = Math.floor(6 * Math.random());
    game.cursor = 0;
    game.score = 0;
    game.level = 0;
    game.colors = 6;
    game.balance = 0;
    game.acc = 0;
    game.vel = 0;
    game.angle = 0;
    game.startTime = +new Date();
    game.timer = setInterval(update, 1000 / 24);
}
function append() {
    var col = game.wing[game.cursor]
    var len = col.length;
    col.push(game.current);
    if (col.length >= 3 && col[len - 2] == col[len]) {
        col.splice(len - 2, 3);
        game.score += 3;
    }
    game.current = game.next;
    game.next = Math.floor(game.colors * Math.random());
    var acc = 0;
    for (var i = 0; i < 8; i++) {
        acc += game.wing[i].length * wt[i];
    }
    game.acc = acc;
}
function setLevel(time) {
    game.level = Math.floor(time / 6);
    game.vel = 0.004 * (20 + game.level);
    if (game.level <= 50) {
        game.colors = 6;
    } else if (game.level <= 100) {
        game.colors = 7;
    } else {
        game.colors = 8;
    }
}
function update() {
    setLevel((+new Date() - game.startTime) * 0.001);
    if (game.acc == 0) {
        if (game.balance > 0) {
            game.balance -= Math.min(game.balance, 0.4);
        } else {
            game.balance += Math.min(-game.balance, 0.4);
        }
    }
    game.balance += game.acc * game.vel;
    game.angle = game.balance / 8;
    if (game.balance < -200 || game.balance > 200) {
        clearInterval(game.timer);
        window.location.reload();
    }
}
