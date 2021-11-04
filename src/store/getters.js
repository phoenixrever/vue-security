const getters = {
  token: state => state.user.token,
  name(state){
    return state.user.name
  },
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  routers: state => state.user.routers,
  sidebar:state => state.app.sidebar,
}
export default getters
