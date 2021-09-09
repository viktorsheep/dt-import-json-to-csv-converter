<template>
  <el-row>
    <el-col :span="24" style="text-align: center;">
      <p>
        Please select a JSON file to convert.
      </p>
      <el-upload
        ref="upload"
        class="upload-demo"
        action=""
        :auto-upload="false"
        :on-change="handleUploaderChange"
      >
        <el-button slot="trigger" size="small" type="primary">
          Select File
        </el-button>

        <div slot="tip" class="el-upload__tip" />
      </el-upload>

      <br>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      json: {}
    }
  },
  computed: {
    ...mapGetters({
      getJSON: 'json/getJSON'
    })
  },
  mounted () {
    this.$refs.upload.value = null
  },
  methods: {
    ...mapActions({
      addJSON: 'json/add',
      deleteJSON: 'json/delete',
      editJSON: 'json/edit'
    }),
    submitUpload () {
      // this.$refs.upload.submit()
    },
    handleUploaderChange (file, fileList) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.addJSON(JSON.parse(e.target.result))
      }
      reader.readAsText(file.raw)
      this.$router.push('mapping')
    }
  }
}
</script>

<style>

</style>
