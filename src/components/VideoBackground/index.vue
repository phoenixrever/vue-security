<template>
  <video
    playsinline
    muted
    loop
    autoplay
    id="bgvid"
    ref="bgvid"
    width="100%"
    height="100%"
  >
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
  },
  methods: {
    //获取video的第一帧
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
