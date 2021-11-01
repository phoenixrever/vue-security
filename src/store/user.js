const user = {
  //开启命名空间  false的话 ...mapState('user',['sum','school','subject']), user是不认识的 只能自己拿到user.属性
  namespaced: true,
  state: {token: ''},
  mutations: {
    SET_TOKEN(state, value) {
      state.token = value
      localStorage.setItem('token',state.token)
      console.log(value);
    }
  },
  actions: {},
  getters: {
    token(state) {
      return state.token
    }
  }
}

export default user
