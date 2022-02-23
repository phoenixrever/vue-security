<template>
  <div class="box">
    <div class="left">
      <el-button>选择手机</el-button>
    </div>
    <div class="wrapper">
      <div class="marvel-device iphone8 silver">
        <div class="top-bar"></div>
        <div class="sleep"></div>
        <div class="volume"></div>
        <div class="camera"></div>
        <div class="sensor"></div>
        <div class="speaker"></div>
        <div class="screen">
          <!-- Content goes here -->
        </div>
        <div class="home"></div>
        <div class="bottom-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/devices.min.css";
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.box {
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.left {
}
.wrapper {
  background: red;
  transform: scale(0.7, 0.7);
  -ms-transform: scale(0.7, 0.7); /* IE 9 */
  -webkit-transform: scale(0.7, 0.7); /* Safari and Chrome */
  /*缩放之后顶点对齐  水平 垂直*/
  transform-origin: 0% 50%;
}

.iphone5s .screen,
.iphone8 .screen,
.iphone8plus .screen {
  background: #e2e4e4;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#e2e4e4),
    to(#7d8281)
  );
  background: linear-gradient(to bottom, #e2e4e4 0%, #7d8281 100%);
}
.iphone5s.gold .screen,
.iphone8.gold .screen,
.iphone8plus.gold .screen {
  background: #f1e2d0;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#f1e2d0),
    to(#ebdac7)
  );
  background: linear-gradient(to bottom, #f1e2d0 0%, #ebdac7 100%);
}
.iphone5s.black .screen,
.iphone8.black .screen,
.iphone8plus.black .screen {
  background: #b3b3b7;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#b3b3b7),
    to(#424044)
  );
  background: linear-gradient(to bottom, #b3b3b7 0%, #424044 100%);
}
.iphone5c.white .screen {
  background: #d9d9d9;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#d9d9d9),
    to(#a1a1a1)
  );
  background: linear-gradient(to bottom, #d9d9d9 0%, #a1a1a1 100%);
}
.iphone5c.red .screen {
  background: #ff7474;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#ff7474),
    to(#dc94df)
  );
  background: linear-gradient(to bottom, #ff7474 0%, #dc94df 100%);
}
.iphone5c.yellow .screen {
  background: #ffec6d;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#ffec6d),
    to(#ffa546)
  );
  background: linear-gradient(to bottom, #ffec6d 0%, #ffa546 100%);
}
.iphone5c.blue .screen {
  background: #9dcefd;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#9dcefd),
    to(#66d3ad)
  );
  background: linear-gradient(to bottom, #9dcefd 0%, #66d3ad 100%);
}
.iphone5c.green .screen {
  background: #97d555;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#97d555),
    to(#d3ed20)
  );
  background: linear-gradient(to bottom, #97d555 0%, #d3ed20 100%);
}
.nexus5 .screen {
  -webkit-box-shadow: none;
  box-shadow: none;
  background: #f3424b;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#f3424b),
    to(#ffd51f)
  );
  background: linear-gradient(to bottom, #f3424b 0%, #ffd51f 100%);
}
.ipad .screen {
  background: #0d3477;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#0d3477),
    to(#adf3de)
  );
  background: linear-gradient(to bottom, #0d3477 0%, #adf3de 100%);
}
.lumia920.black .screen {
  background: #fcfff4;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fcfff4),
    color-stop(40%, #dfe5d7),
    to(#b3bead)
  );
  background: linear-gradient(to bottom, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
}
.lumia920.white .screen {
  background: #fff;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#e5e5e5)
  );
  background: linear-gradient(to bottom, #fff 0%, #e5e5e5 100%);
}
.lumia920.blue .screen {
  background: #fff;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#00acdd)
  );
  background: linear-gradient(to bottom, #fff 0%, #00acdd 100%);
}
.lumia920.red .screen {
  background: #fff;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#e62e1f)
  );
  background: linear-gradient(to bottom, #fff 0%, #e62e1f 100%);
}
.lumia920 .screen {
  background: #fff;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#fd0)
  );
  background: linear-gradient(to bottom, #fff 0%, #fd0 100%);
}
.iphone4s .screen {
  background: #efefbb;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#efefbb),
    to(#d4d3dd)
  );
  background: linear-gradient(to bottom, #efefbb 0%, #d4d3dd 100%);
}
.s5 .screen {
  -webkit-box-shadow: none;
  box-shadow: none;
  background: #1d976c;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#1d976c),
    to(#93f9b9)
  );
  background: linear-gradient(to bottom, #1d976c 0%, #93f9b9 100%);
}
.htc-one .screen {
  background: #283048;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#283048),
    to(#859398)
  );
  background: linear-gradient(to bottom, #283048 0%, #859398 100%);
}
.macbook .screen {
  background: #f16046;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#f16046),
    to(#395f84)
  );
  background: linear-gradient(to bottom, #f16046 0%, #395f84 100%);
}
.iphone-x .screen {
  background: #ff268e;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#ff268e),
    to(#ff694f)
  );
  background: linear-gradient(to bottom, #ff268e 0%, #ff694f 100%);
}
.iphone-x .screen:before {
  content: "";
  width: 140%;
  height: 100%;
  position: absolute;
  top: -30%;
  right: -70%;
  background: radial-gradient(
    ellipse at center,
    #3e4ff9 0%,
    rgba(62, 79, 249, 0) 64%
  );
}
.iphone-x .screen:after {
  content: "";
  width: 140%;
  height: 140%;
  position: absolute;
  bottom: -50%;
  left: -30%;
  background: radial-gradient(
    ellipse at center,
    #f7ede1 0%,
    rgba(247, 237, 225, 0) 70%
  );
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}
.note8 .screen {
  background: #2288fe;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#2288fe),
    to(#fdeba9)
  );
  background: linear-gradient(to bottom, #2288fe 0%, #fdeba9 100%);
}
</style>
