var game = new Vue({
    el: '#maingame',
    data: {
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
            col.push(Math.floor(6 * Math.random()) + 1);
        }
        wing.push(col);
    }
    game.wing = wing;
}
