export const actions = {
  add ({ commit }, payload) {
    commit('ADD_JSON', payload)
  },

  delete ({ commit }) {
    commit('DELETE_JSON')
  },

  edit ({ commit }, payload) {
    commit('EDIT_JSON')
  }
}
export default actions
