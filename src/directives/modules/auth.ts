import type { Directive, DirectiveBinding } from 'vue'

// import { useAuthStore } from '@/store'
/**
 * v-auth
 * 按钮权限指令
 */
const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // const { value } = binding
    // const authStore = useAuthStore()
    // const currentPageRoles: string[] = authStore.authButtonList ?? []
    // if (Array.isArray(value) && value.length) {
    //   const hasPermission = value.every((item: string) => currentPageRoles.includes(item))
    //   if (!hasPermission)
    //     el.remove()
    // }
    // else {
    //   if (!currentPageRoles.includes(value))
    //     el.remove()
    // }
  },
}

export default auth
