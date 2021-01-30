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
function init() {
    game.skirt = 0;
    game.body = 0;
    game.next = Math.floor(6 * Math.random());
    game.angle = 0;
    var wing = [];
    for (var i = 0; i < 8; i++) {
        var col = [];
        for (var j = 0; j < 4; j++) {
            col.push(Math.floor(6 * Math.random()));
        }
        wing.push(col);
    }
    game.wing = wing;
}
function append() {
    var len = game.wing[game.cursor].length;
    game.wing[game.cursor].push(game.current);
    if (game.wing[game.cursor][len - 2] == game.wing[game.cursor][len]) {
        game.wing[game.cursor].splice(len - 2, 3);
    }
    game.current = game.next;
    game.next = Math.floor(6 * Math.random());
}
