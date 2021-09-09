<template>
  <div>
    <el-row
      v-if="!convertStatus"
    >
      <el-col>
        <el-alert
          title="Deleted data will be restored when going back to previous page."
          type="info"
          show-icon
          :closable="false"
        />
      </el-col>
    </el-row>

    <el-row
      v-if="!convertStatus"
    >
      <el-col>
        <el-table
          v-if="headers.length !== 0"
          :data="paginatedJSON"
          style="width: 100%"
          size="mini"
        >
          <el-table-column
            v-for="header in formattedHeaders"
            :key="header.idx"
            :prop="header.rename"
            :label="header.rename"
          />

          <el-table-column
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete-solid"
                plain
                @click="handleDeleteClick(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row
      v-if="!convertStatus"
      style="margin-top: 20px;"
    >
      <el-col :span="18">
        <el-pagination
          :current-page.sync="paginate.current_page"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mappedJSON.length"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
      <el-col :span="6" style="text-align: right;">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="handleConvert"
        >
          Convert
        </el-button>
      </el-col>
    </el-row>

    <el-row
      v-if="convertStatus"
    >
      <el-col>
        <h2 style="text-align: center;">
          Conversion completed.
        </h2>
        <div style="text-align: center;">
          <el-link
            :href="encodeURI(linkValue)"
            target="_blank"
            download="churchdata.csv"
          >
            <el-button
              type="primary"
              icon="el-icon-download"
            >
              Download
            </el-button>
          </el-link>

          <div>
            <nuxt-link to="/">
              <el-button
                type="text"
              >
                Back To Home
              </el-button>
            </nuxt-link>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Parser } from 'json2csv'
export default {
  data () {
    return {
      pagination: {
        current_page: 1,
        page_size: 10
      },
      paginatedJSON: [],
      formattedHeaders: [],
      convertStatus: false,
      linkValue: ''
    }
  },

  computed: {
    ...mapGetters({
      mappedCSV: 'mapping_data/getMappingData',
      mappedJSON: 'mapping_data/getMappingDataJSON',
      headers: 'mapping_data/getMappingDataHeaders',
      json: 'json/getJSON'
    })
  },

  watch: {
    mappedJSON (n, o) {
      this.paginate(1)
    },
    headers (n, o) {
      n.forEach((h) => {
        if (h.importStat) {
          this.formattedHeaders.push(h)
        }
      })
    }
  },

  mounted () {
    this.paginate(this.pagination.current_page)
    this.formatHeaders(this.headers)
  },

  methods: {
    ...mapActions({
      addJSON: 'json/add',
      addMappedJSON: 'mapping_data/addJSON'
    }),

    handleSizeChange (size) {
      this.pagination.page_size = size
      this.paginate(this.pagination.current_page)
    },

    handleCurrentChange (page) {
      this.paginate(page)
    },

    paginate (pageNumber) {
      this.paginatedJSON = this.mappedJSON.slice((pageNumber - 1) * this.pagination.page_size, pageNumber * this.pagination.page_size)
    },

    formatHeaders (headers) {
      headers.forEach((h) => {
        if (h.importStat) { this.formattedHeaders.push(h) }
      })
    },

    handleDeleteClick (row) {
      const updatedMappedJSON = this.mappedJSON.filter((j) => {
        return j[Object.keys(row)[0]] !== row[Object.keys(row)[0]]
      })

      this.addMappedJSON(updatedMappedJSON)
    },

    handleConvert () {
      const fields = Object.keys(this.mappedJSON[0])
      const opts = { fields }

      try {
        const parser = new Parser(opts)
        this.linkValue = 'data:text/csv;charset=utf-8,' + parser.parse(this.mappedJSON)
        this.convertStatus = true
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
