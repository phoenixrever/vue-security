export default function (component) {
  switch (component) {
    case 'Layout':
      return () => import("@/layout")
    default:
      return () => import('@/views/' + component)
  }
}

/**
 *   newItem.component = resolve => require([`@/views/${item.component}`],resolve)

 // 此处用reqiure比较好，import引入变量会有各种莫名的错误
 // newItem.component = (() => import(`@/views/${item.component}`));
 */
