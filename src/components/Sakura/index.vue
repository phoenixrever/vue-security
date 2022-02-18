<template>
  <canvas id="sakura"> </canvas>
</template>

<script>
// import sakura from "./sakura.js";

export default {
  name: "SakuraBackground",
  mounted() {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*Sakura animation using WebGL. No images are used. The framerate might be slow or the demo might not play at all in some older systems so you can watch this video: http://www.screenr.com/BFZ8. Let me make it clear that I did not make this and just thought is was very cool and wanted to share it.
*/

body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 600px;
}
canvas {
  padding: 0;
  margin: 0;
}
div.btnbg {
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 0px 0px 15px #ccc;
}
div.btnbg:hover {
  text-shadow: 0px 0px 3px #ccc;
  box-shadow: 0px 0px 20px #ccc;
}
</style>
