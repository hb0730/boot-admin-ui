interface HookArgs {
  type: 'mounted' | 'activated'
}

export function onMountedOrActivated(hook: (args: HookArgs | any) => void) {
  let mounted: boolean

  onMounted(() => {
    hook({ type: 'mounted' })
    nextTick(() => {
      mounted = true
    })
  })

  onActivated(() => {
    if (mounted) {
      hook({ type: 'activated' })
    }
  })
}
