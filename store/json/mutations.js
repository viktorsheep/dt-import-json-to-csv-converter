const mutations = {
  ADD_JSON (state, json) {
    state.json = json
  },
  DELETE_JSON (state, json) {
    state.json = []
  },
  EDIT_JSON (state, json) {
    state.json = json
  }
}
export default mutations
