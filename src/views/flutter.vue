<template>
  <div class="box">
    <div class="left">
      <el-button>选择手机</el-button>
    </div>
    <div class="phone-box">
      <div class="marvel-device iphone8 silver">
        <div class="top-bar"></div>
        <div class="sleep"></div>
        <div class="volume"></div>
        <div class="camera"></div>
        <div class="sensor"></div>
        <div class="speaker"></div>
        <div class="screen">
          <div class="container">
            <el-image :src="require('@/assets/flutter/screen1.jpg')" fit="cover"></el-image>
          </div>
         </div>
        </div>
        <div class="home"></div>
        <div class="bottom-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Star from "@/components/Star"
import "@/assets/devices.min.css";

export default {
  components: {
    Star
  },
  data() {
    return {};
  },

  methods: {
    handleScroll(){
      console.log("xxxxx")
    }
  },
};
</script>
<style scoped>
.box {
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.marvel-device .screen {
  box-shadow: 0 0 0 3px #a07c7c;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
/*.marvel-device:after {*/
/*  pointer-events: none;*/
/*}*/



/* Hide scrollbar for Chrome, Safari and Opera */
.marvel-device .screen::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.marvel-device>.screen {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.left {
}

.phone-box {
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
  /*background: url('~@/assets/flutter/screen1.jpg') no-repeat ;*/
  /*background-size:cover*/
}

</style>
