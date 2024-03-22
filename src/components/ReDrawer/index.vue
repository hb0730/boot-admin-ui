<script setup lang="ts">
import { computed, ref } from "vue";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import ExitFullscreen from "@iconify-icons/ri/fullscreen-exit-fill";
import { ButtonProps, DrawerOptions, EventType } from "./type";
import { isFunction } from "@pureadmin/utils";
import { closeDrawer, drawerStore } from ".";

const fullscreen = ref(false);

const fullscreenClass = computed(() => {
  return [
    "el-icon",
    "el-dialog__close",
    "-translate-x-2",
    "cursor-pointer",
    "hover:!text-[red]"
  ];
});

const footerButtons = computed(() => {
  return (options: DrawerOptions) => {
    return options?.footerButtons?.length > 0
      ? options.footerButtons
      : ([
          {
            label: "取消",
            bg: true,
            btnClick: ({ drawer: { options, index } }) => {
              const done = () =>
                closeDrawer(options, index, { command: "cancel" });
              if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
                options.beforeCancel(done, { options, index });
              } else {
                done();
              }
            }
          },
          {
            label: "确定",
            type: "primary",
            bg: true,
            btnClick: ({ drawer: { options, index } }) => {
              const done = () =>
                closeDrawer(options, index, { command: "sure" });
              if (options?.beforeSure && isFunction(options?.beforeSure)) {
                options.beforeSure(done, { options, index });
              } else {
                done();
              }
            }
          }
        ] as Array<ButtonProps>);
  };
});

function eventsCallBack(
  event: EventType,
  options: DrawerOptions,
  index: number
) {
  fullscreen.value = options?.fullscreen ?? false;
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]({ options, index });
  }
}

function handleClose(
  options: DrawerOptions,
  index: number,
  args = { command: "close" }
) {
  closeDrawer(options, index, args);
  eventsCallBack("close", options, index);
}

defineOptions({
  name: "FormDrawer"
});
</script>

<template>
  <el-drawer
    v-for="(options, index) in drawerStore"
    :key="index"
    v-bind="options"
    v-model="options.visible"
    class="pure-drawer"
    :size="fullscreen ? '100%' : options.width"
    :fullscreen="fullscreen ? true : options?.fullscreen ? true : false"
    @closed="handleClose(options, index)"
    @opened="eventsCallBack('open', options, index)"
    @openAutoFocus="eventsCallBack('openAutoFocus', options, index)"
    @closeAutoFocus="eventsCallBack('closeAutoFocus', options, index)"
  >
    <!-- header -->
    <template
      v-if="options?.fullscreenIcon || options?.headerRenderer"
      #header="{ close, titleId, titleClass }"
    >
      <div
        v-if="options?.fullscreenIcon"
        class="flex items-center justify-between"
      >
        <h4 :id="titleId" :class="titleClass">{{ options?.title }}</h4>
        <i
          v-if="!options?.fullscreen"
          :class="fullscreenClass"
          @click="fullscreen = !fullscreen"
        >
          <IconifyIconOffline
            class="pure-dialog-svg"
            :icon="
              options?.fullscreen
                ? ExitFullscreen
                : fullscreen
                  ? ExitFullscreen
                  : Fullscreen
            "
          />
        </i>
      </div>
      <component
        :is="options?.headerRenderer({ close, titleId, titleClass })"
        v-else
      />
    </template>
    <component
      v-bind="options?.props"
      :is="options.contentRenderer({ options, index })"
      @close="args => handleClose(options, index, args)"
    />
    <!-- footer -->
    <template v-if="!options?.hideFooter" #footer>
      <template v-if="options?.footerRenderer">
        <component :is="options?.footerRenderer({ options, index })" />
      </template>
      <span v-else>
        <template v-for="(btn, key) in footerButtons(options)" :key="key">
          <el-popconfirm
            v-if="btn?.confirm"
            :title="btn?.tips"
            @confirm="
              btn.btnClick({
                drawer: { options, index },
                button: { btn, index: key }
              })
            "
          >
            <template #reference>
              <el-button v-bind="btn">{{ btn?.label }}</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-else
            v-bind="btn"
            @click="
              btn.btnClick({
                drawer: { options, index },
                button: { btn, index: key }
              })
            "
            >{{ btn?.label }}</el-button
          >
        </template>
      </span>
    </template>
  </el-drawer>
</template>

<style lang="scss">
.pure-drawer {
  .el-drawer__header {
    padding-bottom: var(--el-drawer-padding-primary);
    border-bottom: 1px solid #e8e8e8;
  }

  .el-drawer__footer {
    border-top: 1px solid #e8e8e8;
  }
}
</style>
