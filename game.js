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
        acc: 0,
        vel: 0,
        skirt: 0,
        body: 0,
        angle: 0,
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
setInterval(update, 1000 / 24);

function init() {
    game.skirt = 0;
    game.body = 0;
    game.next = Math.floor(6 * Math.random());
    game.angle = 0;
    var wing = [];
    for (var i = 0; i < 8; i++) {
        var col = [];
        for (var j = 0; j < 4; j++) {
            col.push(Math.floor(game.colors * Math.random()));
        }
        wing.push(col);
    }
    game.wing = wing;
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
        acc += game.wing[i].length * wt[i] * 0.01;
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
    game.vel += game.acc;
    game.angle += game.vel;
}
