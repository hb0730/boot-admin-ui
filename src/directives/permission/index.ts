import { usePermissionStoreHook } from "/@/store/modules/permission";
import { Directive } from "vue";
import type { DirectiveBinding } from "vue";
import { tokenStoreHook } from "/@/store/modules/token";

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (tokenStoreHook().isCurrentUserAdmin()) {
      return;
    }
    if (value) {
      const authRoles = value;
      const hasAuth = usePermissionStoreHook().buttonAuth.includes(authRoles);
      if (!hasAuth) {
        el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("need roles! Like v-auth=\"['admin','test']\"");
    }
  }
};
