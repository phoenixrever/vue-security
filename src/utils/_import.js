export default file=>{
  return map[file] || null
}

const map={
  'Layout':()=>import ('@/layout'),
  'index':()=>import ('@/views/Index'),
  'login':()=>import ('@/views/Login'),
}
