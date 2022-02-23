<template>
  <div class="phone-box">
    <i class="fa fa-github" id="github"></i>
  </div>
</template>

<script>
import "font-awesome/css/font-awesome.css";

export default {
  name: "Social",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.phone-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 120px;
  cursor: pointer;
}
#github {
  font-size: 40px;
  color: #fff;
}

#github:hover {
  text-shadow: 0 0 100px #666, 0 0 100px #666, 0 0 100px #666, 0 0 100px #666,
    0 0 100px #666, 0 0 50px #000, 0 0 50px #000, 0 0 50px #000, 0 0 50px #000,
    0 0 50px #000;
}
</style>
