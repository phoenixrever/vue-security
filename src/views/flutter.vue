<template>
  <div class="page">
    <div class="left">
      <div class="drop" @mouseover="animate">
        <span class="fa fa-wechat"></span>
        <span class="download animate__animated">download</span>
      </div>
      <el-button>download</el-button>
    </div>
    <div class="box">
      <div class="container">
        <img :src="require('@/assets/flutter/screen1.jpg')" />
        <img :src="require('@/assets/flutter/screen1.jpg')" />
        <img :src="require('@/assets/flutter/screen1.jpg')" />
        <img :src="require('@/assets/flutter/screen1.jpg')" />
      </div>
      <div class="center">
        <div class="phone-box">
          <div class="marvel-device iphone8 silver">
            <div class="top-bar"></div>
            <div class="sleep"></div>
            <div class="volume"></div>
            <div class="camera"></div>
            <div class="sensor"></div>
            <div class="speaker"></div>
            <div class="screen"></div>
            <div class="home"></div>
            <div class="bottom-bar"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Star from "@/components/Star"
import "@/assets/devices.min.css";
import "font-awesome/css/font-awesome.css";
import "animate.css";

export default {
  components: {
    // Star
  },
  data() {
    return {};
  },

  methods: {
    animate() {
      let elem = document.querySelector(".download");
      if (!elem.classList.contains("animate__rubberBand")) {
        elem.classList.add("animate__rubberBand");
      }
      setTimeout(() => {
        elem.classList.remove("animate__rubberBand");
      }, 1000);
    },
  },
};
</script>
<style scoped>
.page {
  height: 100vh;
  display: flex;
  background: #eee;
}

.marvel-device .screen {
  box-shadow: 0 0 0 3px #a07c7c;
}

.left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 水滴标签*/
.drop {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: inset 10px 10px 10px rgba(0, 0, 0, 0.05),
    15px 25px 10px rgba(0, 0, 0, 0.05), 15px 20px 20px rgba(0, 0, 0, 0.05),
    inset -10px -10px 15px rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.drop::before {
  content: "";
  position: absolute;
  top: 35px;
  left: 25px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
}

.drop::after {
  content: "";
  position: absolute;
  top: 25px;
  left: 50px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
}

.drop .fa-wechat {
  font-size: 3em;
  color: #444;
}

.box {
  flex: 1;
  position: relative;
  left: 0px;
  width: 600px;
  height: 800px;
}

.center {
  position: absolute;
  top: 80px;
}

.phone-box {
  transform: scale(0.7, 0.7);
  -ms-transform: scale(0.7, 0.7); /* IE 9 */
  -webkit-transform: scale(0.7, 0.7); /* Safari and Chrome */
  /*缩放之后顶点对齐  水平 垂直*/
  transform-origin: 0% 0%;
}

.container {
  position: relative;
  left: 14px;
  top: 152px;
  width: 267px;
  height: 500px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0);
  transition: 0.5s;
}
.container img {
  position: absolute;
  width: 100%;
  transition: 0.5s;
}
.container:hover img:nth-child(4) {
  transform: translate(450px, 0px);
  opacity: 1;
}
.container:hover img:nth-child(3) {
  transform: translate(300px, 0px);
  opacity: 0.8;
}
.container:hover img:nth-child(2) {
  transform: translate(150px, 0px);
  opacity: 0.6;
}
.container:hover img:nth-child(1) {
  transform: translate(0px, 0px);
  opacity: 0.4;
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
  /*background: url('~@/assets/flutter/screen1.jpg') no-repeat ;*/
  /*background-size:cover*/
}
</style>
