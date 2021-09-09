<template>
  <el-container>
    <el-header>
      <AppHeader />
    </el-header>
    <el-container>
      <el-main
        style="min-height: calc(100vh - 140px);"
      >
        <AppBack />
        <br>
        <Nuxt />
      </el-main>
    </el-container>
    <el-container>
      <AppFooter />
    </el-container>
  </el-container>
</template>

<script>
export default {
}
</script>

<style>

</style>
