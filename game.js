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
        face: 0,
        time: 0,
        startTime: 0,
        timer: 0,
        status: "title",
    },
    methods: {
        append: function () {
            var col = this.wing[this.cursor]
            var len = col.length;
            col.push(this.current);
            playSound("set");
            if (col.length >= 3 && col[len - 2] == col[len]) {
                col.splice(len - 2, 3);
                this.score += 3;
                playSound("erase");
            }
            this.current = this.next;
            this.next = Math.floor(this.colors * Math.random());
            var acc = 0;
            for (var i = 0; i < 8; i++) {
                acc += this.wing[i].length * wt[i];
            }
            this.acc = acc;
        },
        init: function () {
            var wing = [];
            for (var i = 0; i < 8; i++) {
                wing.push([Math.floor(this.colors * Math.random())]);
            }
            this.wing = wing;
            this.next = Math.floor(6 * Math.random());
            this.current = Math.floor(6 * Math.random());
            this.cursor = 0;
            this.score = 0;
            this.level = 0;
            this.colors = 6;
            this.balance = 0;
            this.acc = 0;
            this.vel = 0;
            this.angle = 0;
            this.face = 1;
            this.time = 0;
            this.startTime = +new Date();
            this.timer = setInterval(update, 1000 / 24);
            playSound("music");
        }
    }
});

document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case "ArrowLeft": if (game.cursor > 0) game.cursor -= 1; break;
        case "ArrowRight": if (game.cursor < 7) game.cursor += 1; break;
        case "KeyZ": case "Space": game.append(); break;
        default: break;
    };
});

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
    var time = (+new Date() - game.startTime) * 0.001;
    setLevel(time);
    game.time = Math.floor(time);
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
        alert("GAME OVER\nSCORE: " + game.score);
        window.location.reload();
    } else if (game.balance < -120 || game.balance > 120) {
        game.face = 0;
    } else {
        if (time % 4 > 3.9) {
            game.face = 2;
        } else if (time % 4 > 3.8) {
            game.face = 3;
        } else if (time % 4 > 3.7) {
            game.face = 2;
        } else {
            game.face = 1;
        }
    }
}
function playSound(name) {
    var sound = document.querySelector("audio#au_" + name);
    sound.play();
    sound.currentTime = 0;
}
