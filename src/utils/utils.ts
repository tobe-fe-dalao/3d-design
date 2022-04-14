import { saveAs } from "file-saver";
/**
 * 导出为文件
 * @param {any} data 导出的数据
 * @param {string} fileName 文件名+后缀
 * @param {string} type 文件类型
 */
export function exportToFile(
  data: any,
  fileName: string,
  type: string = "text/plain;charset=utf-8"
) {
  var blob = new Blob([JSON.stringify(data)], { type });
  saveAs(blob, fileName);
}

// 节流
export function throttle (fn: { apply: (arg0: any, arg1: any[]) => void }, t: number) {
  let flag = true
  const interval = t || 500
  return function (this: any, ...args: any) {
    if (flag) {
      fn.apply(this, args)
      flag = false
      setTimeout(() => {
        flag = true
      }, interval)
    }
  }
}

// 防抖
export function debounce (fn: { apply: (arg0: any, arg1: any) => void }, t: number) {
  let timeId: any = null
  const delay = t || 500
  return function (this: any, ...args: any) {
    if (timeId) {
      clearTimeout(timeId)
    }
    timeId = setTimeout(() => {
      timeId = null
      fn.apply(this, args)
    }, delay)
  }
}
