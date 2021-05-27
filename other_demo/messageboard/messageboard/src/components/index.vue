<template>
  <div>
    <div class="fun">
      <router-link to="/board" tag="button">留言板</router-link>
    </div>
    <router-view />
    <div class="by">
      <h5 title="点击前往">
        <a href="https://space.bilibili.com/326333253" target="_block">Bilibili：南小濡</a>
      </h5>
    </div>
  </div>
</template>

<style scoped>
.by{
  position: absolute;
  bottom: 20px;
  width: 1200px;
  height: auto;
  border: 1px solid #c4c4c4;
  padding: 20px 10px;
  font-size: 20px;
  text-align: center;
}

.by > h5{
  cursor: pointer;
}

.by > h5 > a{
  color: #00bfff;
}
</style>