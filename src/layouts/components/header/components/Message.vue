<script setup lang="ts">
// import * as noticeMessageApi from '@/api/modules/auth'
import router from '@/router'
import { useGlobalStore, useUserStore } from '@/store'

// const { setActiveUserInfoPanel } = useUserStore()
const { setGlobalState } = useGlobalStore()
const timer = ref<any>(null)
const hasUnRead = ref<boolean>(false)
const messageList = ref<any[]>([])
const countUnRead = ref<number>(0)
const readingVisible = ref<boolean>(false)
const currentItem = ref<any>(null)
async function loadData() {
  // const { success, data } = await noticeMessageApi.getNoticeMsg({ sorts: 'created', size: 10, status: 0 })
  // if (success) {
  //   messageList.value = data.records || []
  // }
}
async function queryHashUnreadMessage() {
  // const { success, data } = await noticeMessageApi.getNoticeMsgHasUnread()
  // if (success) {
  //   hasUnRead.value = data
  // }
}

async function queryCountUnreadMessage() {
  // const { success, data } = await noticeMessageApi.getNoticeMsgCount(true)
  // if (success) {
  //   countUnRead.value = data
  //   setGlobalState('unreadCount', data)
  // }
}

async function readingMessage(item: any) {
  // const { success } = await noticeMessageApi.readNoticeMsg(item.id)
  // if (success) {
  //   loadData()
  //   queryHashUnreadMessage()
  //   queryCountUnreadMessage()
  // }
}

onMounted(() => {
  // // 获取消息列表
  loadData()
  queryHashUnreadMessage()
  queryCountUnreadMessage()
  // // 定时获取消息列表
  timer.value = setInterval(() => {
    queryHashUnreadMessage()
    queryCountUnreadMessage()
  }, 1000 * 10)
})

function handleRead(item: any) {
  currentItem.value = item
  readingVisible.value = true
  readingMessage(item)
}

onUnmounted(() => {
  // 清除定时器
  clearInterval(timer.value)
})

watch(hasUnRead, (val) => {
  if (val) {
    loadData()
  }
})

async function handleAllRead() {
  // const { success } = await noticeMessageApi.readAllNoticeMsg()
  // if (success) {
  //   loadData()
  //   queryHashUnreadMessage()
  //   queryCountUnreadMessage()
  // }
}

async function handleMore() {
  // setActiveUserInfoPanel('messageList')
  router.push('/userInfo')
}
</script>

<template>
  <div class="message">
    <ElPopover placement="bottom" :width="270" trigger="click">
      <template #reference>
        <el-badge :is-dot="hasUnRead" class="item">
          <ReIcon size="16" icon="svg-icon:bell-outlined" class="toolBar-icon" />
        </el-badge>
      </template>
      <el-tabs stretch>
        <el-tab-pane label="通知">
          <div v-if="messageList.length > 0" class="message-list">
            <li
              v-for="item in messageList"
              :key="item.id"
              class="message-item"
              @click="handleRead(item)"
            >
              <div class="item-meta">
                <div class="item-meta-content">
                  <h4 class="item-meta-title">
                    <div class="title">
                      <el-badge :is-dot="true" :offset="[-6, 15]" />
                      <a>{{ item.title }}</a>
                    </div>
                  </h4>
                  <div class="item-meta-description">
                    <span>{{ item.created }}</span>
                  </div>
                </div>
              </div>
            </li>
          </div>
          <div v-else class="message-empty">
            <el-empty description="暂无消息" />
          </div>
          <el-divider />
          <div class="flex items-center justify-between px-4">
            <el-button type="primary" link size="small" @click="handleMore">
              查看更多
              <ReIcon icon="svg-icon:arrow-right" />
            </el-button>
            <el-button
              v-show="countUnRead > 0"
              type="primary"
              link
              size="small"
              @click="handleAllRead"
            >
              全部已读
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </ElPopover>

    <NoticeReading v-model:visible="readingVisible" :data="currentItem" />
  </div>
</template>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  // 高度
  max-height: 200px;
  overflow-y: auto;
  .message-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border-bottom: none;
    }
    .item-meta {
      display: flex;
      flex: 1;
      align-items: flex-start;
      max-width: 100%;
      .item-meta-content {
        flex: 1 0;
        width: 0;
        .item-meta-title {
          margin-bottom: 4px;
          font-size: 14px;
          margin-top: 0;
          margin-bottom: 0.5em;
          font-weight: 500;
          .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            .badge {
              margin-right: 5px;
            }
          }
          a {
            color: #1677ff;
            text-decoration: none;
            background-color: transparent;
            outline: none;
            cursor: pointer;
            transition: color 0.3s;
          }
        }
        .item-meta-description {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
