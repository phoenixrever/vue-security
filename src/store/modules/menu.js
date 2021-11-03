
const routerMap = {
  'Layout':() => import('@/views/layout/Layout'),
  'reportProIntro': () => import('@/views/reportSystem/reportProIntro/index'),
  'reportProDetail': () => import('@/views/reportSystem/reportProDetail/index'),
  'collectionDaily': () => import('@/views/reportSystem/collectionDaily/index'),
  'performanceRanking': () => import('@/views/reportSystem/performanceRanking/index')


  const menu = {
  state:{
    items:[]
  },
  mutations:{
    ADD_MENU: (state,menuItems) => {
      if(menuItems.length == 0){
        state.items = [];
      }else{
        state.items = menuItems;
      }
    }
  },
  actions:{
    //context 里面有commit 方法
    addMenu:({commit},menuItems) => {
      let menu = generateRoutesFromMenu(menuItems)
      menu.push(asyncRouterMap[0]);
      commit('ADD_MENU',menu);
    }
  }
}


function generateRoutesFromMenu(menu = []){
  menu[0].component = routerMap.Layout;
  menu[0].redirect = 'reportProIntro';
  menu[0].name = 'Example';
  menu[0].meta = { title: '报表中心', icon: 'example' };
  menu[0].children = transferChildren(menu[0].children);
  return menu
}

function transferChildren(childrenArr){
  //格式化name,component,meta属性
  console.log(childrenArr)
  childrenArr.map((cur,index)=>{
    cur.name = cur.path;
    cur.component = routerMap[cur.path];
    cur.meta = {'title':cur.title}
    if(cur.children.length > 0){
      transferChildren(cur.children)
    }
  })
  return childrenArr
}

export default menu
