const getters = {
  getMappingData: (state) => { return state.mapping_data },
  getMappingDataJSON: (state) => { return state.mapping_data_json },
  getMappingDataHeaders: (state) => { return state.headers }
}
export default getters
