import type { PlusColumn } from 'plus-pro-components'

export function usePermissionForm() {
  const currentRow = ref({})
  const formVisible = ref(false)
  const formModel = ref({})
  const formColumns: PlusColumn[] = []
  const formRules = {}

  return {
    currentRow,
    formVisible,
    formModel,
    formColumns,
    formRules,
  }
}
