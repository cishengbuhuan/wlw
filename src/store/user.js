const state = {
  user: {}
}

const getters = {
  getUser: state => state.user
}

const mutations = {
  updateUserInfo(state, user) {
    state.user.userId = user.userId;
    state.user.companyName = user.companyName;
    state.user.companyId = user.companyId;
    state.user.userName = user.userName;
  },
  logout(){
    state.user.userId = null;
    state.user.companyName = null;
    state.user.companyId = null;
    state.user.userName = null;
  }
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}
