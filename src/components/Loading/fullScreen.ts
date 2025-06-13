import { ElLoading } from 'element-plus'

/* 全局请求 loading */
let loadingInstance: ReturnType<typeof ElLoading.service>

/**
 * @description 开启 Loading
 */
function startLoading() {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
}

/**
 * @description 结束 Loading
 */
function endLoading() {
  loadingInstance.close()
}

/**
 * @description 显示全屏加载
 */
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

/**
 * @description 隐藏全屏加载
 */
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0)
    return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
