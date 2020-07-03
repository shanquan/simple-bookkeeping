<template>
  <el-container id="app" style="height:100vh;border: 1px solid #eee">
    <el-header class="main">
      <div class="title center">
        简易记账
      </div>
      <router-link v-if="$route.name=='home'" to="/bill/new"><el-button type="primary" round icon="el-icon-plus">记一笔</el-button></router-link>
      <router-link v-else to="/"><el-button type="primary" round icon="el-icon-arrow-left">返回</el-button></router-link>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
    margin: 0;
    padding: 0
  }
a{text-decoration: none}
.el-main{padding:0;overflow-x:hidden}
  .el-header.main {
    font-size: 12px;
    background-color: rgb(64, 158, 255);
    color: #fff;
    line-height: 60px;
    padding-right:2px
  }

  .main .el-dropdown {
    color: #fff
  }
  .main .el-button{
    float:right;
    line-height: 32px;
    font-size: 16px;
  }

  .header-logo {
    display: inline-block;
    vertical-align: middle;
  }
  .el-header .title{
    font-size:18px;
    display:inline-flex;
    padding:0 10px;
    /* max-width: 160px; */
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-footer {
    line-height: 60px;
    font-size:14px;
    border-top:solid 1px #eaeefb;
  }
.center{
  text-align: center
}
</style>
