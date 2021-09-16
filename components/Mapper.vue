<template>
  <div v-loading="loading">
    <el-alert
      :title="`Total Church Data : ${totalChurches}`"
      :closable="false"
      type="info"
      description="You can map and manipulate data fields here."
      show-icon
    />

    <br>
    <el-row v-if="!progress">
      <el-col>
        <el-table
          v-if="mapped.headers"
          :data="headers"
          size="small"
          style="width: 100%"
        >
          <el-table-column
            label="Field Names ( Rename if necessary )"
            width="400"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.rename"
                size="small"
                placeholder="Please enter a Field Name"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="Data Rule"
            width="200"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.dataRule.value"
                size="small"
                placeholder="Select"
              >
                <el-option
                  v-for="ds in options.dataRule"
                  :key="ds.idx"
                  :label="ds.value"
                  :value="ds.value"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column
            label="Fallback"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.dataRule.conditions.fallback.status" />
            </template>
          </el-table-column>

          <el-table-column
            label="Configurations"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.dataRule.value === 'Yes / No if present'">
                <p><b>Data Status : Yes / No</b></p>
                <el-form :inline="true" :model="scope.row.dataRule.conditions.boolean">
                  <el-form-item label="If data present">
                    <el-input
                      v-model="scope.row.dataRule.conditions.boolean.yes"
                      size="small"
                      placeholder="Data representative"
                      style="width: 100px;"
                    />
                  </el-form-item>
                  <el-form-item label="If no data">
                    <el-input
                      v-model="scope.row.dataRule.conditions.boolean.no"
                      size="small"
                      placeholder="Data absence"
                      style="width: 100px;"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <div v-if="scope.row.dataRule.value === 'Merge with other cell'">
                <p><b>Data Status : Merge</b></p>
                <el-select
                  v-model="scope.row.dataRule.conditions.merge.fieldName"
                  size="small"
                  placeholder="Select"
                >
                  <el-option
                    v-for="header in options.headers"
                    :key="header"
                    :label="header"
                    :value="header"
                  />
                </el-select>

                <el-input
                  v-model="scope.row.dataRule.conditions.merge.joiner"
                  size="small"
                  placeholder="Joiner. E.g. ','"
                  style="width: 100px;"
                />
              </div>

              <div v-if="scope.row.dataRule.conditions.fallback.status">
                <p><b>Fallback Configurations</b></p>

                <el-select
                  v-model="scope.row.dataRule.conditions.fallback.type"
                  size="small"
                  placeholder="Select"
                >
                  <el-option
                    v-for="f in options.fallback"
                    :key="f"
                    :label="f"
                    :value="f"
                  />
                </el-select>

                <el-select
                  v-if="scope.row.dataRule.conditions.fallback.type === 'Data Field'"
                  v-model="scope.row.dataRule.conditions.fallback.value"
                  size="small"
                  placeholder="Select"
                  style="margin-top: 10px;"
                >
                  <el-option
                    v-for="f in options.headers"
                    :key="f"
                    :label="f"
                    :value="f"
                  />
                </el-select>

                <el-input
                  v-if="scope.row.dataRule.conditions.fallback.type === 'Value'"
                  v-model="scope.row.dataRule.conditions.fallback.value"
                  size="small"
                  placeholder="Data absence"
                  style="margin-top: 10px;"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="Import Rule"
            align="right"
            width="150"
          >
            <template slot-scope="scope">
              <el-tooltip :content="'Switch value: ' + scope.row.importStat" placement="top" />
              <el-switch
                v-model="scope.row.importStat"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="float: right;"
              />

              <span v-if="scope.row.importStat">Import</span>
              <span v-else>Don't Import</span>
          &nbsp;
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row v-if="progress">
      <el-col>
        <el-progress :percentage="percentageProgress" />
      </el-col>
    </el-row>

    {{ percentageProgress }}
    {{ mappedHeaders.length }}

    <el-row style="margin-top: 20px;">
      <el-col style="text-align: center;">
        <el-button
          v-if="percentageProgress === 0 && !progress"
          type="primary"
          icon="el-icon-aim"
          @click="handleConvert"
        >
          Confirm and Map
        </el-button>

        <el-button
          v-if="percentageProgress === 100 && progress"
          type="primary"
          @click="handleReview"
        >
          Review and Download
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {

  data () {
    return {
      headers: [],
      loading: false,
      progress: false,
      percentage: 0,
      mapped: {
        headers: false
      },
      options: {
        dataRule: [{
          idx: 1,
          value: 'Same value'
        },
        {
          idx: 2,
          value: 'Yes / No if present'
        },
        {
          idx: 3,
          value: 'Merge with other cell'
        }
        ],
        headers: [],
        fallback: [
          'Data Field',
          'Value'
        ]
      }
    }
  },

  fetch () {
  },

  computed: {
    ...mapGetters({
      json: 'json/getJSON',
      mappedHeaders: 'mapping_data/getMappingDataHeaders'
    }),
    totalChurches () {
      return this.json.length
    },
    percentageProgress () {
      return Math.round((this.percentage / this.json.length) * 100)
    }
  },

  mounted () {
    this.mapHeadings()
  },

  methods: {
    ...mapActions({
      deleteJSON: 'json/delete',
      setMapDataCSV: 'mapping_data/addCSV',
      setMapDataJSON: 'mapping_data/addJSON',
      setMapDataHeaders: 'mapping_data/addHeaders'
    }),

    format (percentage) {
      return percentage === (this.totalChurches) ? 'Mapping Completed' : `${percentage}%`
    },

    calculateProgress (amount) {
      this.download.downloadedSize = (this.download.downloadedSize + amount)
      this.download.percentage = Math.round((this.download.downloadedSize / this.download.totalSize) * 100)
    },

    mapHeadings () {
      if (this.mappedHeaders.length === 0) {
        this.json.forEach((church) => {
          this.loading = true
          const churchHeaders = Object.keys(church)

          churchHeaders.forEach((ch) => {
            if (!this.headers.find(h => h.name === ch)) {
              this.options.headers.push(ch)
              this.headers.push({
                name: ch,
                rename: ch,
                idx: (this.headers.length + 1),
                importStat: false,
                dataRule: {
                  value: 'Same value',
                  conditions: {
                    merge: {
                      fieldName: '',
                      joiner: ''
                    },
                    boolean: {
                      yes: 'yes',
                      no: 'no'
                    },
                    fallback: {
                      status: false,
                      type: '',
                      value: ''
                    }
                  }
                }
              })
            }
          })
        })
      } else {
        const mappingDataHeaders = [
          ...this.mappedHeaders
        ]
        this.headers = [...mappingDataHeaders]
        this.headers.forEach((h) => {
          this.options.headers.push(h.name)
        })
      }
      this.loading = false
      this.mapped.headers = true
    },

    handleConvert () {
      this.initConvert()
    },

    initConvert () {
      this.progress = true

      const fields = []
      const csvFields = []
      this.headers.forEach((h) => {
        if (h.importStat) { csvFields.push(h.rename) }
        fields.push(h)
      })

      let csvStr = csvFields.join(',') + '\n'
      const cdJSONData = []

      this.json.forEach((churchData) => {
        const cd = []
        const cdJSON = {}

        this.headers.forEach((h) => {
          if (h.importStat) {
            // setting fallback value
            const fallbackValue = h.dataRule.conditions.fallback.status ? this.checkFallback(h, churchData) : ''

            // data rules
            if (h.dataRule.value === 'Same value') {
              if (churchData[h.name] === undefined) {
                if (h.dataRule.conditions.fallback.status) {
                  cd.push('"' + fallbackValue.toString().trim() + '"')
                  cdJSON[h.rename] = fallbackValue.toString().trim()
                } else {
                  cd.push(churchData[h.name].toString().trim())
                  cdJSON[h.rename] = churchData[h.name].toString().trim()
                }
              } else {
                cd.push(churchData[h.name].toString().trim())
                cdJSON[h.rename] = churchData[h.name].toString().trim()
              }
            } else if (h.dataRule.value === 'Yes / No if present') {
              churchData[h.name] !== undefined
                ? cd.push(h.dataRule.conditions.boolean.yes)
                : cd.push(h.dataRule.conditions.boolean.no)

              cdJSON[h.rename] = churchData[h.name] !== undefined
                ? h.dataRule.conditions.boolean.yes
                : h.dataRule.conditions.boolean.no
            } else if (h.dataRule.value === 'Merge with other cell') {
              if (churchData[h.name] === undefined) {
                if (h.dataRule.conditions.fallback.status) {
                  cd.push(fallbackValue.toString().trim())
                  cdJSON[h.rename] = fallbackValue.toString().trim()
                } else {
                  cd.push(h.dataRule.conditions.merge.joiner + churchData[h.dataRule.conditions.merge.fieldName] === undefined
                    ? ''
                    : churchData[h.dataRule.conditions.merge.fieldName] === undefined ? '' : churchData[h.dataRule.conditions.merge.fieldName].toString().trim()
                  )

                  cdJSON[h.rename] = h.dataRule.conditions.merge.joiner + churchData[h.dataRule.conditions.merge.fieldName] === undefined
                    ? ''
                    : churchData[h.dataRule.conditions.merge.fieldName] === undefined ? '' : churchData[h.dataRule.conditions.merge.fieldName].toString().trim()
                }
              } else {
                cd.push(churchData[h.name].toString().trim() + h.dataRule.conditions.merge.joiner + churchData[h.dataRule.conditions.merge.fieldName].toString().trim())
                cdJSON[h.rename] = churchData[h.name].toString().trim() + h.dataRule.conditions.merge.joiner + churchData[h.dataRule.conditions.merge.fieldName].toString().trim()
              }
            } else {
              cd.push(fallbackValue !== '' ? fallbackValue.toString().trim() : '')
              cdJSON[h.rename] = ''
            }
          }
        })
        cdJSONData.push(cdJSON)
        csvStr += cd.join(',') + '\n'
        this.percentage++
      })
      this.setMapDataCSV(csvStr)
      this.setMapDataJSON(cdJSONData)
      this.setMapDataHeaders(fields)
    },

    handleReview () {
      this.$router.push('review')
    },

    checkFallback (h, churchData) {
      return h.dataRule.conditions.fallback.status
        ? (h.dataRule.conditions.fallback.type === 'Data Field'
            ? churchData[h.dataRule.conditions.fallback.value]
            : h.dataRule.conditions.fallback.value
          )
        : ''
    }
  }

}
</script>

<style>

</style>
