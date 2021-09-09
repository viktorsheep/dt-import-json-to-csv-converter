export const actions = {
  addCSV ({ commit }, payload) {
    commit('SET_MAPPING_DATA', payload)
  },

  deleteCSV ({ commit }) {
    commit('DELETE_MAPPING_DATA')
  },

  addJSON ({ commit }, payload) {
    commit('SET_MAPPING_DATA_JSON', payload)
  },

  deleteJSON ({ commit }) {
    commit('DELETE_MAPPING_DATA_JSON')
  },

  addHeaders ({ commit }, payload) {
    commit('SET_MAPPING_DATA_HEADERS', payload)
  },

  deleteHeaders ({ commit }) {
    commit('DELETE_MAPPING_DATA_HEADERS')
  }
}
export default actions
