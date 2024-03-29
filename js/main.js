function getCookie(e) {
    for (var o = e + "=", t = document.cookie.split(";"), s = 0; s < t.length; s++) {
        var a = t[s].trim();
        if (0 == a.indexOf(o))
            return a.substring(o.length, a.length)
    }
    return ""
}
function setCookie(e, o, t) {
    var s = new Date;
    s.setTime(s.getTime() + 24 * t * 60 * 60 * 1e3);
    var a = "expires=" + s.toGMTString();
    document.cookie = e + "=" + o + "; " + a
}
function showSplash() {
    currentstate = states.SplashScreen,
    velocity = 0,
    position = 180,
    rotation = 0,
    score = 0,
    $("#player").css({
        y: 0,
        x: 0
    }),
    updatePlayer($("#player")),
    soundSwoosh.stop(),
    soundSwoosh.play(),
    $(".pipe").remove(),
    pipes = new Array,
    $(".animated").css("animation-play-state", "running"),
    $(".animated").css("-webkit-animation-play-state", "running"),
    $("#splash").transition({
        opacity: 1
    }, 2e3, "ease")
}
function startGame() {
    currentstate = states.GameScreen,
    soundHit.play(),
    soundHit.stop(),
    $("#splash").stop(),
    $("#splash").transition({
        opacity: 0
    }, 500, "ease"),
    setBigScore(),
    debugmode && $(".boundingbox").show();
    var e = 1e3 / 60;
    loopGameloop = setInterval(gameloop, e),
    loopPipeloop = setInterval(updatePipes, 1400),
    playerJump(),
    soundNasheed.stop(),
    soundNasheed.play()
}
function updatePlayer(e) {
    rotation = Math.min(velocity / 10 * 40, 40),
    $(e).css({
        rotate: rotation,
        top: position
    })
}
function gameloop() {
    var e = $("#player");
    velocity += gravity,
    position += velocity,
    updatePlayer(e);
    var o = document.getElementById("player").getBoundingClientRect()
      , t = 34
      , s = 24
      , a = t - 8 * Math.sin(Math.abs(rotation) / 90)
      , i = (s + o.height) / 2
      , n = (o.width - a) / 2 + o.left
      , r = (o.height - i) / 2 + o.top
      , p = n + a
      , c = r + i;
    if (debugmode) {
        var l = $("#playerbox");
        l.css("left", n),
        l.css("top", r),
        l.css("height", i),
        l.css("width", a)
    }
    if (o.bottom >= $("#land").offset().top)
        return void playerDead();
    var u = $("#ceiling");
    if (r <= u.offset().top + u.height() && (position = 0),
    null != pipes[0]) {
        var d = pipes[0]
          , h = d.children(".pipe_upper")
          , m = h.offset().top + h.height()
          , y = h.offset().left - 2
          , g = y + pipewidth
          , f = m + pipeheight;
        if (debugmode) {
            var l = $("#pipebox");
            l.css("left", y),
            l.css("top", m),
            l.css("height", pipeheight),
            l.css("width", pipewidth)
        }
        return p > y && !(r > m && f > c) ? void playerDead() : void (n > g && (pipes.splice(0, 1),
        playerScore()))
    }
}
function screenClick() {
    currentstate == states.GameScreen ? playerJump() : currentstate == states.SplashScreen && startGame()
}
function playerJump() {
    velocity = jump,
    soundJump.stop(),
    soundJump.play()
}
function setBigScore(e) {
    var o = $("#bigscore");
    if (o.empty(),
    !e)
        for (var t = score.toString().split(""), s = 0; s < t.length; s++)
            o.append("<img src='assets/font_big_" + t[s] + ".png' alt='" + t[s] + "'>")
}
function setSmallScore() {
    var e = $("#currentscore");
    e.empty();
    for (var o = score.toString().split(""), t = 0; t < o.length; t++)
        e.append("<img src='assets/font_small_" + o[t] + ".png' alt='" + o[t] + "'>")
}
function setHighScore() {
    var e = $("#highscore");
    e.empty();
    for (var o = highscore.toString().split(""), t = 0; t < o.length; t++)
        e.append("<img src='assets/font_small_" + o[t] + ".png' alt='" + o[t] + "'>")
}
function setMedal() {
    var e = $("#medal");
    return e.empty(),
    10 > score ? !1 : (score >= 10 && (medal = "bronze"),
    score >= 20 && (medal = "silver"),
    score >= 30 && (medal = "gold"),
    score >= 40 && (medal = "platinum"),
    e.append('<img src="assets/medal_' + medal + '.png" alt="' + medal + '">'),
    !0)
}
function playerDead() {
    $(".animated").css("animation-play-state", "paused"),
    $(".animated").css("-webkit-animation-play-state", "paused");
    var e = $('<div id="explosion" style="top: ' + $("#player").position().top + 'px; left:60px;"></div>');
    $("#flyarea").append(e);
    var o = $("#player").position().top + $("#player").width()
      , t = $("#flyarea").height()
      , s = Math.max(0, t - o);
    $("#player").transition({
        y: s + "px",
        rotate: 90
    }, 1e3, "easeInOutCubic"),
    currentstate = states.ScoreScreen,
    clearInterval(loopGameloop),
    clearInterval(loopPipeloop),
    loopGameloop = null,
    loopPipeloop = null,
    isIncompatible.any() ? (soundHit.play(),
    showScore()) : soundHit.play().bindOnce("ended", function() {
        soundDie.play().bindOnce("ended", function() {
            showScore()
        })
    })
}
function showScore() {
    soundNasheed.stop(),
    $("#scoreboard").css("display", "block"),
    setBigScore(!0),
    score > highscore && (highscore = score,
    setCookie("highscore", highscore, 999)),
    setSmallScore(),
    setHighScore();
    var e = setMedal();
    soundSwoosh.stop(),
    soundSwoosh.play(),
    $("#scoreboard").css({
        y: "40px",
        opacity: 0
    }),
    $("#replay").css({
        y: "40px",
        opacity: 0
    }),
    $("#scoreboard").transition({
        y: "0px",
        opacity: 1
    }, 600, "ease", function() {
        soundSwoosh.stop(),
        soundSwoosh.play(),
        $("#replay").transition({
            y: "0px",
            opacity: 1
        }, 600, "ease"),
        e && ($("#medal").css({
            scale: 2,
            opacity: 0
        }),
        $("#medal").transition({
            opacity: 1,
            scale: 1
        }, 1200, "ease"))
    }),
    replayclickable = !0
}
function playerScore() {
    score += 1,
    soundScore.stop(),
    soundScore.play(),
    setBigScore()
}
function updatePipes() {
    $(".pipe").filter(function() {
        return $(this).position().left <= -100
    }).remove();
    var e = 80
      , o = 420 - pipeheight - 2 * e
      , t = Math.floor(Math.random() * o + e)
      , s = 420 - pipeheight - t
      , a = $('<div class="pipe animated"><div class="pipe_upper" style="height: ' + t + 'px;"></div><div class="pipe_lower" style="height: ' + s + 'px;"></div></div>');
    $("#flyarea").append(a),
    pipes.push(a)
}
var debugmode = !1, states = Object.freeze({
    SplashScreen: 0,
    GameScreen: 1,
    ScoreScreen: 2
}), currentstate, gravity = .25, velocity = 0, position = 180, rotation = 0, jump = -4.6, score = 0, highscore = 0, pipeheight = 100, pipewidth = 52, pipes = new Array, replayclickable = !1;
buzz.defaults.preload = !0,
buzz.defaults.formats = ["ogg", "mp3"];
var volume = 30
  , soundJump = new buzz.sound("assets/sounds/sfx_wing")
  , soundScore = new buzz.sound("assets/sounds/sfx_point")
  , soundDie = new buzz.sound("assets/sounds/sfx_die")
  , soundSwoosh = new buzz.sound("assets/sounds/sfx_swooshing")
  , soundNasheed = new buzz.sound("assets/sounds/nasheed")
  , soundHit = new buzz.sound("assets/sounds/sfx_hit");
buzz.all().setVolume(volume),
soundNasheed.setVolume(30);
var loopGameloop, loopPipeloop;
$(document).ready(function() {
    "?debug" == window.location.search && (debugmode = !0),
    "?easy" == window.location.search && (pipeheight = 200);
    var e = getCookie("highscore");
    "" != e && (highscore = parseInt(e)),
    showSplash()
}),
$(document).keydown(function(e) {
    32 == e.keyCode && (currentstate == states.ScoreScreen ? $("#replay").click() : screenClick())
}),
"ontouchstart"in window ? $(document).on("touchstart", screenClick) : $(document).on("mousedown", screenClick),
$("#replay").click(function() {
    $("#explosion").remove(),
    replayclickable && (replayclickable = !1,
    soundSwoosh.stop(),
    soundSwoosh.play(),
    $("#scoreboard").transition({
        y: "-40px",
        opacity: 0
    }, 1e3, "ease", function() {
        $("#scoreboard").css("display", "none"),
        showSplash()
    }))
});
var isIncompatible = {
    Android: function() {
        return navigator.userAgent.match(/Android/i)
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i)
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i)
    },
    Safari: function() {
        return navigator.userAgent.match(/OS X.*Safari/) && !navigator.userAgent.match(/Chrome/)
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i)
    },
    any: function() {
        return isIncompatible.Android() || isIncompatible.BlackBerry() || isIncompatible.iOS() || isIncompatible.Opera() || isIncompatible.Safari() || isIncompatible.Windows()
    }
};
