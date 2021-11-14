const getters = {
  token: state => state.user.token,
  name(state){
    return state.user.name
  },
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  routers: state => state.user.routers,
  permissions:state => state.user.permissions
}
export default getters
