<template>
  <video playsinline muted loop autoplay ref="bgvid" width="100%" height="100%">
    <source :src="require('@/assets/video-background.mp4')" type="video/mp4" />
  </video>
</template>

<script>
export default {
  data() {
    return {
      poster: "",
    };
  },
  mounted() {
    //不需要
    // this.poster = this.getFirdtVideoFrame();
    // var vidElem = this.$refs.bgvid;
    // console.log(vidElem);
    // vidElem.addEventListener(
    //   "timeupdate",
    //   function () {
    //     // console.log(vidElem.currentTime);
    //     if (vidElem.currentTime >= 3.22) {
    //       vidElem.currentTime = 0.0;
    //       vidElem.play();
    //     }
    //   },
    //   false
    // );
  },
  methods: {
    //获取video的第一帧 暂时用不到好像
    getFirdtVideoFrame() {
      let video = this.$refs.bgvid;
      let canvas = document.createElement("canvas");
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      let img = canvas.toDataURL("image/png");
      // console.log(img);
      return img;
    },
  },
};
</script>

<style scoped></style>
