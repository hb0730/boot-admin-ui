<script setup lang="ts">
import CrontabDay from './day.vue'
import CrontabHour from './hour.vue'
import CrontabMin from './min.vue'
import CrontabMonth from './month.vue'
import CrontabResult from './result.vue'
import CrontabSecond from './second.vue'
import CrontabWeek from './week.vue'
import CrontabYear from './year.vue'

const props = defineProps({
  hideComponent: {
    type: Array,
    default: () => [],
  },
  expression: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['hide', 'fill'])

const tabTitles = ref<string[]>(['秒', '分钟', '小时', '日', '月', '周', '年'])
// const tabActive = ref<number>(0)
const hideComponent = ref<any[]>([])
const expression = ref<string>('')
const crontabValueObj = ref<any>({
  second: '*',
  min: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
  year: '',
})

const crontabValueString = computed(() => {
  const obj = crontabValueObj.value
  return `${obj.second
  } ${
    obj.min
  } ${
    obj.hour
  } ${
    obj.day
  } ${
    obj.month
  } ${
    obj.week
  }${obj.year === '' ? '' : ` ${obj.year}`}`
})

watch(expression, () => resolveExp())
function shouldHide(key: string) {
  return !(hideComponent.value && hideComponent.value.includes(key))
}
function resolveExp() {
  // 反解析 表达式
  if (expression.value) {
    const arr = expression.value.split(/\s+/)
    if (arr.length >= 6) {
      // 6 位以上是合法表达式
      const obj = {
        second: arr[0],
        min: arr[1],
        hour: arr[2],
        day: arr[3],
        month: arr[4],
        week: arr[5],
        year: arr[6] ? arr[6] : '',
      }
      crontabValueObj.value = {
        ...obj,
      }
    }
  }
  else {
    // 没有传入的表达式 则还原
    clearCron()
  }
}

// tab切换值
// function tabCheck(index: number) {
//   tabActive.value = index
// }
// 由子组件触发，更改表达式组成的字段值
function updateCrontabValue(name: string, value: string, _: string) {
  crontabValueObj.value[name] = value
}
// 表单选项的子组件校验数字格式（通过-props传递）
function checkNumber(value: number, minLimit: number, maxLimit: number) {
  // 检查必须为整数
  value = Math.floor(value)
  if (value < minLimit) {
    value = minLimit
  }
  else if (value > maxLimit) {
    value = maxLimit
  }
  return value
}
// 隐藏弹窗
function hidePopup() {
  emit('hide')
  clearCron() // 清空表达式
}
// 填充表达式
function submitFill() {
  emit('fill', crontabValueString.value)
  hidePopup()
}
function clearCron() {
  // 还原选择项
  crontabValueObj.value = {
    second: '*',
    min: '*',
    hour: '*',
    day: '*',
    month: '*',
    week: '?',
    year: '',
  }
}
// onMounted(() => {
//   expression.value = props.expression
//   hideComponent.value = props.hideComponent
// })

watch(
  () => props.expression,
  (value) => {
    expression.value = value
  },
  { immediate: true },
)

watch(
  () => props.hideComponent,
  (value) => {
    hideComponent.value = value
  },
  { immediate: true },
)

defineExpose({
  clearCron,
})
</script>

<template>
  <el-tabs type="border-card">
    <el-tab-pane v-if="shouldHide('second')" label="秒" style="height:100%;">
      <CrontabSecond
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>

    <el-tab-pane v-if="shouldHide('min')" label="分钟">
      <CrontabMin
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>

    <el-tab-pane v-if="shouldHide('hour')" label="小时">
      <CrontabHour
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>

    <el-tab-pane v-if="shouldHide('day')" label="日">
      <CrontabDay
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>

    <el-tab-pane v-if="shouldHide('month')" label="月">
      <CrontabMonth
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>

    <el-tab-pane v-if="shouldHide('week')" label="周">
      <CrontabWeek
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>

    <el-tab-pane v-if="shouldHide('year')" label="年">
      <CrontabYear
        :check="checkNumber"
        :cron="crontabValueObj"
        @update="updateCrontabValue"
      />
    </el-tab-pane>
  </el-tabs>

  <div class="popup-main">
    <div class="popup-result">
      <p class="title">
        时间表达式
      </p>
      <table>
        <thead>
          <tr>
            <th v-for="item of tabTitles" :key="item">
              {{ item }}
            </th>
            <th>Cron 表达式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span v-if="crontabValueObj.second.length < 10">{{ crontabValueObj.second }}</span>
              <el-tooltip v-else :content="crontabValueObj.second" placement="top">
                <span>{{ crontabValueObj.second }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="crontabValueObj.min.length < 10">{{ crontabValueObj.min }}</span>
              <el-tooltip v-else :content="crontabValueObj.min" placement="top">
                <span>{{ crontabValueObj.min }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="crontabValueObj.hour.length < 10">{{ crontabValueObj.hour }}</span>
              <el-tooltip v-else :content="crontabValueObj.hour" placement="top">
                <span>{{ crontabValueObj.hour }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="crontabValueObj.day.length < 10">{{ crontabValueObj.day }}</span>
              <el-tooltip v-else :content="crontabValueObj.day" placement="top">
                <span>{{ crontabValueObj.day }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="crontabValueObj.month.length < 10">{{ crontabValueObj.month }}</span>
              <el-tooltip v-else :content="crontabValueObj.month" placement="top">
                <span>{{ crontabValueObj.month }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="crontabValueObj.week.length < 10">{{ crontabValueObj.week }}</span>
              <el-tooltip v-else :content="crontabValueObj.week" placement="top">
                <span>{{ crontabValueObj.week }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="crontabValueObj.year.length < 10">{{ crontabValueObj.year }}</span>
              <el-tooltip v-else :content="crontabValueObj.year" placement="top">
                <span>{{ crontabValueObj.year }}</span>
              </el-tooltip>
            </td>
            <td class="result">
              <span v-if="crontabValueString.length < 90">{{ crontabValueString }}</span>
              <el-tooltip v-else :content="crontabValueString" placement="top">
                <span>{{ crontabValueString }}</span>
              </el-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CrontabResult :ex="crontabValueString" />

    <div class="pop_btn">
      <el-button type="primary" @click="submitFill">
        确定
      </el-button>
      <el-button type="warning" @click="clearCron">
        重置
      </el-button>
      <el-button @click="hidePopup">
        取消
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pop_btn {
  text-align: center;
  margin-top: 20px;
}
.popup-main {
  margin: 10px auto;
  border-radius: 5px;
  font-size: 12px;
  overflow: hidden;
  background: var(--el-bg-color-overlay);
  display: flex;
  flex-direction: column;
}
.popup-result {
  display: flex;
  flex-direction: column;
  line-height: 24px;
  padding: 15px 10px 10px;
  margin: 25px 0;
  border: 1px solid var(--el-border-color);
}

.popup-result ::v-deep(.title) {
  text-align: center;
  font-size: 14px;
  padding-bottom: 10px;
}
.popup-result table {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}
.popup-result table td:not(.result) {
  width: 3.5rem;
  min-width: 3.5rem;
  max-width: 3.5rem;
}
.popup-result table span {
  display: block;
  width: 100%;
  font-family: arial;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}
</style>
