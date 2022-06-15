<template>
  <div>
    <!--    <water-background></water-background>-->
    <div class="body">
      <div class="left">
        <animation-title class="title"></animation-title>
        <div class="drop-box">
          <!-- mouseenter不支持事件冒泡-->
          <div
            class="drop android animate__animated"
            @mouseover="animate('android')"
            @click="download('android')"
          >
            <span class="fa fa-android"></span>
            <span class="down">Download</span>
          </div>
          <!-- mouseenter不支持事件冒泡-->
          <div
            class="drop apple animate__animated"
            @mouseover="animate('apple')"
            @click="download('apple')"
          >
            <span class="fa fa-apple"></span>
            <span class="down">Not ready yet</span>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="container">
          <img :src="require('@/assets/flutter/screen4.jpg')" />
          <img :src="require('@/assets/flutter/screen3.jpg')" />
          <img :src="require('@/assets/flutter/screen5.jpg')" />
          <img :src="require('@/assets/flutter/screen2.jpg')" />
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
  </div>
</template>

<script>
// import WaterBackground from "@/components/WaterBackground"
import AnimationTitle from "@/components/AnimationTitle";
import "@/assets/devices.min.css";
import "font-awesome/css/font-awesome.css";
import "animate.css";

export default {
  components: {
    // WaterBackground
    AnimationTitle,
  },
  data() {
    return {};
  },

  methods: {
    animate(device) {
      // console.log(device);
      this.animateCSS("." + device, "rubberBand").then((message) => {});
    },

    animateCSS(element, animation, prefix = "animate__") {
      // We create a Promise and return it
      return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
          event.stopPropagation();
          node.classList.remove(`${prefix}animated`, animationName);
          resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, {
          once: true,
        });
      });
    },
    download(device) {
      if (device === "apple") {
        this.$alert("apple is not ready yet 😭", "SORRY", {
          confirmButtonText: "确定",
          callback: (action) => {},
        });
      }else {
        window.open('/fake_summo.apk')
      }
    },
  },
};
</script>
<style scoped>
.body {
  margin: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  /*background: #eee;*/
  background-image: linear-gradient(
    135deg,
    rgb(253, 252, 251) 0%,
    rgb(226, 209, 195) 100%
  );
  overflow: hidden;
}

.marvel-device .screen {
  box-shadow: 0 0 0 3px #a07c7c;
}

.left {
  flex: 1;
}
.title {
  top: 200px;
}
.drop-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.apple {
  margin-left: 50px;
}

.fa-android,
.fa-apple {
  font-size: 3em;
  color: #444;
}

.down {
  color: #444;
  font-family: "Clip", cursive;
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
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  padding: 20px;
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

.box {
  flex: 1;
  position: relative;
  left: 0px;
  width: 600px;
  height: 800px;
}

.center {
  position: absolute;
  top: 60px;
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
  z-index: 1;
  background: rgba(0, 0, 0, 0);
  transition: 0.5s;
}

.container img {
  position: absolute;
  top:-20px;
  width: 100%;
  height: 94%;
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
  /*background: url('~@/assets/flutter/screen1bak.jpg') no-repeat ;*/
  /*background-size:cover*/
}
</style>
