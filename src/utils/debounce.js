/**
 * 防抖函数(频繁获取数据)
 * 立即执行版本 缺点是一直点会不执行 必须等待足够的时间再点才会执行
 * delay 时间短了就不明显自行取舍
 * @param1 执行函数
 * @param2 等待时间
 */
export default function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    if (!timer) {
      func.apply(this, args);
    }
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}
