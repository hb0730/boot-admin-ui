import * as socialApi from '@/api/modules/login'

/**
 *  社交账号绑定
 * @returns
 */
export function useSocialHook() {
  const socialBinds = ref<string[]>([])
  async function bindSocial(source: string) {
    const { success, data } = await socialApi.authBindSocial(source)
    if (success) {
      window.location.href = data
    }
  }
  async function getSocialBinds() {
    const { success, data } = await socialApi.getSocialBind()
    if (success) {
      socialBinds.value = data ?? []
    }
  }

  async function unLockSocial(source: string) {
    const { success } = await socialApi.authUnLockSocial(source)
    if (success) {
      getSocialBinds()
    }
  }

  onMounted(() => {
    getSocialBinds()
  })
  return {
    socialBinds,
    bindSocial,
    unLockSocial,
  }
}
