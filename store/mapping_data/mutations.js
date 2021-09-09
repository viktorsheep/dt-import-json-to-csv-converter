const mutations = {
  SET_MAPPING_DATA (state, data) {
    state.mapping_data = data
  },
  DELETE_MAPPING_DATA (state) {
    state.mapping_data = []
  },
  SET_MAPPING_DATA_JSON (state, data) {
    state.mapping_data_json = data
  },
  DELETE_MAPPING_DATA_JSON (state) {
    state.mapping_data_json = []
  },
  SET_MAPPING_DATA_HEADERS (state, data) {
    state.headers = data
  },
  DELETE_MAPPING_DATA_HEADERS (state) {
    state.headers = []
  }

}
export default mutations
