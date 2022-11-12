// weight
const wt = [-4, -3, -2, -1, 1, 2, 3, 4];

Math.clamp = (v, min, max) => v < min ? min : (v > max ? max : v);

Number.prototype.floor = function() {
    return ~~this + this < 0;
}

Array.prototype.randomChoice = function() {
    return this[~~(this.length * Math.random())];
}

Object.defineProperty(Array.prototype, "minBy", {
    writable: true,
    value: function (callablefn) {
        if (!this.length) return undefined;
        if (this.length == 1) return this[0];

        let minIndex = -1;
        let minValue = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < this.length; i++) {
            let cur = callablefn(this[i]);
            if (cur < minValue) {
                minValue = cur;
                minIndex = i;
            }
        }
        return this[minIndex];
    }
});

const range = (startInclusive = 0, endExclusive) => [...Array(endExclusive - startInclusive).keys()].map(x => x + startInclusive);

class MSTimer {
    constructor() {
        this.passedTime = -1;
    }

    hasTimePassed(MS) {
        return +new Date() >= this.passedTime + ~~MS;
    }

    hasTimeLeft(MS) {
        return ~~MS + this.passedTime - new Date();
    }

    reset() {
        this.passedTime = +new Date();
    }
}

var game = new Vue({
    el: '#maingame',
    data: {
        x0: 360,
        y0: 760,
        // wing crystals translation
        data_tr: ["translate(-290 -102)", "translate(-230 -80)", "translate(-170 -58)", "translate(-110 -36)", "translate(110 -36)", "translate(170 -58)", "translate(230 -80)", "translate(290 -102)"],
        // colors str
        data_cl: ["red", "yellow", "green", "blue", "orange", "cyan", "purple", "pink"],
        // difficulty
        // difficultyNames: ["Easy", "Normal", "Hard", "Lunatic"],
        // difficulty: 0,
        canErase: [],
        // 8 wings
        wing: [[], [], [], [], [], [], [], []],
        // next crystal index
        next: 0,
        // current crystal index
        current: 0,
        // current cursor index (in 0..8)
        cursor: 0,
        // score
        score: 0,
        // level init, combined with color count
        level: 0,
        // using colors count
        colors: 6,
        balance: 0,
        // (\alpha) angular acceleration
        acc: 0,
        // (\omega) angular velocity
        vel: 0,
        // (\theta) angular displacement
        angle: 0,
        // expression
        face: 0,
        // second
        time: 0,
        startTime: 0,
        timeGauge: new MSTimer(),
        timeLimit: 5.0e3,
        timer: 0,
        bgm: null,
        end: false,
        fallingTicks: 0,
        fallY: 0,
        fallX: 0,
        fallRotation: 0,
        demoFrequency: 2,
        demoTimer: 0,
        status: "title",
        // TODO
        buttonStatus: [0, 0, 0, 0]
    },
    methods: {
        append: function () {
            if (this.fallingTicks > 0)
                return;

            var col = this.wing[this.cursor];
            var len = col.length;
            col.push(this.current);
            this.playSound("set");
            if (len >= 2 && col[len - 2] == col[len]) {
                col.splice(len - 2, 3);
                this.score += 3;
                this.playSound("erase");
            }

            this.current = this.next;
            this.next = ~~(this.colors * Math.random());
            this.acc = range(0, 8).map(i => this.wing[i].length * wt[i]).reduce((sum, x) => sum + x, 0);
            this.timeGauge.reset();
        },
        init: function ()  {
            this.wing.forEach(pos => {
                pos.length = 0;
                pos.push(~~(this.colors * Math.random()));
            });
            this.next = ~~(this.colors * Math.random());
            this.current = ~~(this.colors * Math.random());
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
            this.timeGauge.reset();
            this.fallingTicks = -8,
            this.fallY = 0,
            this.fallX = 0,
            this.fallRotation = 0,
            this.startTime = +new Date();
            if (!this.timer)
                this.timer = setInterval(update, 1000 / 24);
            this.bgm = this.playSound("music");
            // Auto Play
            if (this.status == "demo" && !this.demoTimer)
                this.demoTimer = setTimeout(() => {
                    this.demoTimer = setInterval(autoPlay, 1000 / this.demoFrequency);
                }, 2500);
        },
        stop: function() {
            this.bgm?.pause();
            (this.status == "game" || this.status == "demo") && clearInterval(this.timer);
            this.status == "demo" && clearInterval(this.demoTimer);
            game.timer = game.demoTimer = 0;
        },
        playSound: function(name) {
            var sound = document.querySelector("audio#au_" + name);
            sound.play();
            sound.currentTime = 0;
            return sound;
        }
    }
});

document.addEventListener('keydown', function (e) {
    if (game.status != 'game') return;
    switch (e.code) {
        case "ArrowLeft": if (game.cursor > 0) game.cursor -= 1; break;
        case "ArrowRight": if (game.cursor < 7) game.cursor += 1; break;
        case "KeyZ": case "Space": game.append(); break;
        default: break;
    };
});

function setLevel(time) {
    game.level = ~~(time / 6);
    game.vel = 0.004 * (20 + game.level);
    game.colors = Math.min(6 + ~~(game.level / 25), 8);
}

function update() {
    var time = (+new Date() - game.startTime) * 0.001;
    setLevel(time);
    game.time = ~~time;

    if (game.acc == 0) {
        if (game.balance > 0) {
            game.balance -= Math.min(game.balance, 0.4);
        } else {
            game.balance += Math.min(-game.balance, 0.4);
        }
    }
    game.balance += game.acc * game.vel;
    game.angle = game.balance / 8;

    if (Math.abs(game.balance) > 200) { // failure animation
        var balance = game.balance = Math.clamp(game.balance, -240, 240);

        var fallingTicks = ++game.fallingTicks;
        if (fallingTicks > 0) {
            if (game.bgm?.id == "au_music") {
                game.bgm.pause();
                game.bgm.currentTime = 0;
                game.bgm = game.playSound("fall");
            }
            game.fallX = (fallingTicks * (fallingTicks + 4)) * Math.sign(balance);
            game.fallY = fallingTicks * (fallingTicks + 1) * 6;
            game.fallRotation = fallingTicks * 1.5 * Math.sign(balance);
        }

        if (game.y0 + game.fallY > 1280 + 1280) {
            clearInterval(game.timer);
            if (game.status == "demo") {
                clearInterval(game.demoTimer);
                setTimeout(() => game.status = "title", 1500);
            } else {
                game.status = "end";
            }
            game.timer = game.demoTimer = 0;
        }
    } else if (Math.abs(game.balance) > 120) { // scared
        game.face = 0;
    } else { // blink
        var blinkPeriod = 4; // second
        var animatePeriod = 0.3; // second
        
        var currentTime = time % blinkPeriod;

        if (currentTime > blinkPeriod - animatePeriod / 3) {
            game.face = 2;
        } else if (currentTime > blinkPeriod - animatePeriod * 2 / 3) {
            game.face = 3;
        } else if (currentTime > blinkPeriod - animatePeriod) {
            game.face = 2;
        } else {
            game.face = 1;
        }
    }

    // time limit
    if (game.timeGauge.hasTimePassed(game.timeLimit)) {
        game.append();
    }
}

const getAcc = (indexToAppend) => range(0, 8).map(i => (game.wing[i].length + (indexToAppend == i)) * wt[i]).reduce((sum, x) => sum + x, 0);

// debug
function autoPlay() {
    var positionCanErase = range(0, 8).filter(i => {
        let col = game.wing[i];
        return col.length >= 2 && col[col.length - 2] == game.current;
    });
    var index, pos = game.balance >= 0 && 4;

    // 存在可以消除的串 -> 在运动反方向一侧 选取最靠近平衡的消去 (若反方向没有可以消去的则在反方向侧随机摆放)
    if (positionCanErase.length && ~(index = positionCanErase
            .filter(i => i - pos | 3 + pos - i)
            .minBy(getAcc) ?? ~~(4 * Math.random() + 4 - pos))) {
        game.cursor = index;
    } else {
        game.cursor = range(4 - pos, 8 - pos).sort(() => 0.5 - Math.random()).minBy(j => game.wing[j].length < 13 ? Math.abs(getAcc(j)) : Math.MAX_SAFE_INTEGER);
    }

    game.append();
}
