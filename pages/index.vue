<template>
  <div>
    <h1 style="text-align: center;">
      Welcome to JSON to CSV converter
    </h1>
    <Converter />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  mounted () {
    this.deleteJSON()
    this.deleteMCSV()
    this.deleteMJSON()
    this.deleteMHeaders()
  },
  methods: {
    ...mapActions({
      deleteJSON: 'json/delete',
      deleteMCSV: 'mapping_data/deleteCSV',
      deleteMJSON: 'mapping_data/deleteJSON',
      deleteMHeaders: 'mapping_data/deleteHeaders'
    })
  }
}
</script>
