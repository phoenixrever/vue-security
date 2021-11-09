const getters = {
  token: state => state.user.token,
  name(state){
    return state.user.name
  },
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  routers: state => state.user.routers,
}
export default getters
