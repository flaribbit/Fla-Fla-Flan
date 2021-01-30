var game = new Vue({
    el: '#maingame',
    data: {
        data_tr: ["translate(-290 -102)", "translate(-230 -80)", "translate(-170 -58)", "translate(-110 -36)", "translate(290 -102)", "translate(230 -80)", "translate(170 -58)", "translate(110 -36)"],
        data_cl: ["red", "yellow", "green", "blue", "orange", "cyan", "purple", "black"],
        wing: [[], [], [], [], [], [], [], []],
        skirt: 0,
        body: 0,
        angle: 0,
    }
});
init();
function init() {
    game.skirt = 0;
    game.body = 0;
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
