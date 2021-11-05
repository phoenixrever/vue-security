export default function (component) {
  switch (component) {
    case 'Layout':
      return () => import("@/layout")
    default:
      return () => import('@/views/' + component)
  }
}
