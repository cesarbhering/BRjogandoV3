<template>
    <footer>
      <div class="bottom-line"></div>
    </footer>
</template>

<script >
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
footer {
  height: 80px;
  background-color: #040c2d;
  display: flex;
  flex-direction: row;
}
.bottom-line {
  height: 2px;
  width: 100vw;
  position: absolute;
  background-image: linear-gradient(to right, #ffdf00, #009c3b);
  align-self: flex-end;
}

.box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  right: 30px;
  margin-left: 71px;
}
img {
  height: 50px;
}
nav ul {
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  list-style: none;
  color: #ffff;
}

ul a {
  color: #ffff;
  text-decoration: none;
}

.v-btn {
  text-transform: none;
  background-color: transparent;
  color: #ffff;
  padding: 0;
  display: inline;
}
.v-list-item a {
  text-decoration: none;
  color: #000;
}

.v-list-item:hover a {
  color: #ffff;
}

.v-list-item:hover {
  background-image: linear-gradient(45deg, #040c2d 40%, #002776, #ffff);
  color: #ffff;
}
</style>