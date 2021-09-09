<template>
  <div v-if="notRoot" style="padding-bottom: 10px; border-bottom: 1px solid #eee">
    <el-button round icon="el-icon-back" @click="goBack">
      Back
    </el-button>
    &nbsp;

    <div style="display: inline-block; text-right; float:right; height: 40px; line-height: 40px; font-size: 18px; color: #999; text-transform: uppercase;">
      {{ header }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {

    notRoot () {
      const routePath = this.$route.path.split('/')
      return routePath[1] !== ''
    },

    header () {
      const rp = this.$route.path.split('/')
      return rp[1]
    }
  },
  mounted () {
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
</style>
