<script setup lang="ts">
const props = defineProps({
  ex: {
    type: String,
    default: '',
  },
})
const dayRule = ref<string>('')
const dayRuleSup = ref<any>('')
const dateArr = ref<any[]>([])
const resultList = ref<any[]>([])
const isShow = ref<boolean>(false)

watch(() => props.ex, () => expressionChange())

// 表达式值变化时，开始去计算结果
function expressionChange() {
  isShow.value = false
  const ruleArr = props.ex.split(' ')
  let nums = 0
  const resultArr: string[] = []
  const nTime = new Date()
  let nYear = nTime.getFullYear()
  let nMonth = nTime.getMonth() + 1
  let nDay = nTime.getDate()
  let nHour = nTime.getHours()
  let nMin = nTime.getMinutes()
  let nSecond = nTime.getSeconds()

  getSecondArr(ruleArr[0])
  getMinArr(ruleArr[1])
  getHourArr(ruleArr[2])
  getDayArr(ruleArr[3])
  getMonthArr(ruleArr[4])
  getWeekArr(ruleArr[5])
  getYearArr(ruleArr[6], nYear)

  const sDate = dateArr.value[0]
  const mDate = dateArr.value[1]
  const hDate = dateArr.value[2]
  const DDate = dateArr.value[3]
  const MDate = dateArr.value[4]
  const YDate = dateArr.value[5]

  let sIdx = getIndex(sDate, nSecond) ?? 0
  let mIdx = getIndex(mDate, nMin) ?? 0
  let hIdx = getIndex(hDate, nHour) ?? 0
  let DIdx = getIndex(DDate, nDay) ?? 0
  let MIdx = getIndex(MDate, nMonth) ?? 0
  const YIdx = getIndex(YDate, nYear) ?? 0

  // 重置月日时分秒的函数(后面用的比较多)
  const resetSecond = function () {
    sIdx = 0
    nSecond = sDate[sIdx]
  }
  const resetMin = function () {
    mIdx = 0
    nMin = mDate[mIdx]
    resetSecond()
  }
  const resetHour = function () {
    hIdx = 0
    nHour = hDate[hIdx]
    resetMin()
  }
  const resetDay = function () {
    DIdx = 0
    nDay = DDate[DIdx]
    resetHour()
  }
  const resetMonth = function () {
    MIdx = 0
    nMonth = MDate[MIdx]
    resetDay()
  }

  if (nYear !== YDate[YIdx])
    resetMonth()
  if (nMonth !== MDate[MIdx])
    resetDay()
  if (nDay !== DDate[DIdx])
    resetHour()
  if (nHour !== hDate[hIdx])
    resetMin()
  if (nMin !== mDate[mIdx])
    resetSecond()

  let shouldExit = false

  for (let Yi = YIdx; Yi < YDate.length && !shouldExit; Yi++) {
    const YY = YDate[Yi]
    console.log('Processing Year:', YY)

    if (nMonth > MDate[MDate.length - 1]) {
      resetMonth()
      continue
    }

    for (let Mi = MIdx; Mi < MDate.length && !shouldExit; Mi++) {
      const MM = MDate[Mi].toString().padStart(2, '0')
      console.log('Processing Month:', MM)

      if (nDay > DDate[DDate.length - 1]) {
        resetDay()
        continue
      }

      for (let Di = DIdx; Di < DDate.length && !shouldExit; Di++) {
        const DD = DDate[Di].toString().padStart(2, '0')
        let thisDD = DD.toString().padStart(2, '0')
        console.log('Processing Day:', thisDD)

        if (nHour > hDate[hDate.length - 1]) {
          resetHour()
          continue
        }

        if (!isValidDate(YY, MM, thisDD)) {
          resetDay()
          continue
        }

        adjustDateForRules(YY, MM, DD, thisDD)
        thisDD = DD.toString().padStart(2, '0')

        for (let hi = hIdx; hi < hDate.length && !shouldExit; hi++) {
          const hh = hDate[hi].toString().padStart(2, '0')
          console.log('Processing Hour:', hh)

          if (nMin > mDate[mDate.length - 1]) {
            resetMin()
            continue
          }

          for (let mi = mIdx; mi < mDate.length && !shouldExit; mi++) {
            const mm = mDate[mi].toString().padStart(2, '0')
            console.log('Processing Minute:', mm)

            if (nSecond > sDate[sDate.length - 1]) {
              resetSecond()
              continue
            }

            for (let si = sIdx; si < sDate.length && !shouldExit; si++) {
              const ss = sDate[si].toString().padStart(2, '0')
              console.log('Processing Second:', ss)

              if (MM !== '00' && DD !== '00') {
                resultArr.push(`${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`)
                nums++
              }

              if (nums === 5) {
                console.log('Result Limit Reached:', resultArr)
                shouldExit = true // 设置标志变量，退出所有循环
                break
              }
            }
          }
        }
      }
    }
  }
  if (resultArr.length === 0) {
    resultList.value = ['没有达到条件的结果！']
  }
  else {
    resultList.value = resultArr
    if (resultArr.length !== 5) {
      resultList.value.push(`最近100年内只有上面${resultArr.length}条结果！`)
    }
  }
  isShow.value = true
}

// Helper function to validate date
function isValidDate(year: number, month: string, day: string): boolean {
  const date = new Date(`${year}-${month}-${day}`)
  return (
    date.getFullYear() === year
    && date.getMonth() + 1 === Number.parseInt(month)
    && date.getDate() === Number.parseInt(day)
  )
}

// Helper function to adjust date based on rules
function adjustDateForRules(YY: number, MM: string, DD: number, thisDD: string) {
  if (dayRule.value === 'lastDay') {
    while (DD > 0 && !isValidDate(YY, MM, thisDD)) {
      DD--
      thisDD = DD.toString().padStart(2, '0')
    }
  }
  else if (dayRule.value === 'workDay') {
    while (DD > 0 && !isValidDate(YY, MM, thisDD)) {
      DD--
      thisDD = DD.toString().padStart(2, '0')
    }
    const thisWeek = formatDate(new Date(`${YY}-${MM}-${thisDD} 00:00:00`), 'week')
    if (thisWeek === 1) {
      DD++
      thisDD = DD.toString().padStart(2, '0')
      if (!isValidDate(YY, MM, thisDD)) {
        DD -= 3
      }
    }
    else if (thisWeek === 7) {
      DD += dayRuleSup.value === 1 ? 2 : -1
    }
  }
}

// 用于计算某位数字在数组中的索引
function getIndex(arr: number[], value: number) {
  if (value <= arr[0] || value > arr[arr.length - 1]) {
    return 0
  }
  else {
    for (let i = 0; i < arr.length - 1; i++) {
      if (value > arr[i] && value <= arr[i + 1]) {
        return i + 1
      }
    }
  }
}
// 获取"年"数组
function getYearArr(rule: string, year: number) {
  dateArr.value[5] = getOrderArr(year, year + 100)
  if (rule !== undefined) {
    if (rule.includes('-')) {
      dateArr.value[5] = getCycleArr(rule, year + 100, false)
    }
    else if (rule.includes('/')) {
      dateArr.value[5] = getAverageArr(rule, year + 100)
    }
    else if (rule !== '*') {
      dateArr.value[5] = getAssignArr(rule)
    }
  }
}
// 获取"月"数组
function getMonthArr(rule: string) {
  dateArr.value[4] = getOrderArr(1, 12)
  if (rule.includes('-')) {
    dateArr.value[4] = getCycleArr(rule, 12, false)
  }
  else if (rule.includes('/')) {
    dateArr.value[4] = getAverageArr(rule, 12)
  }
  else if (rule !== '*') {
    dateArr.value[4] = getAssignArr(rule)
  }
}
// 获取"日"数组-主要为日期规则
function getWeekArr(rule: string) {
  // 只有当日期规则的两个值均为“”时则表达日期是有选项的
  if (dayRule.value === '' && dayRuleSup.value === '') {
    if (rule.includes('-')) {
      dayRule.value = 'weekDay'
      dayRuleSup.value = getCycleArr(rule, 7, false)
    }
    else if (rule.includes('#')) {
      dayRule.value = 'assWeek'
      const matchRule = rule.match(/\d/g)
      if (matchRule) {
        dayRuleSup.value = [Number(matchRule[1]), Number(matchRule[0])]
      }
      // dayRuleSup.value = [Number(matchRule[1]), Number(matchRule[0])]
      dateArr.value[3] = [1]
      if (dayRuleSup.value[1] === 7) {
        dayRuleSup.value[1] = 0
      }
    }
    else if (rule.includes('L')) {
      dayRule.value = 'lastWeek'
      const matchRule = rule.match(/\d{1,2}/g)
      if (matchRule) {
        dayRuleSup.value = Number(matchRule[0])
      }
      dateArr.value[3] = [31]
      if (dayRuleSup.value === 7) {
        dayRuleSup.value = 0
      }
    }
    else if (rule !== '*' && rule !== '?') {
      dayRule.value = 'weekDay'
      dayRuleSup.value = getAssignArr(rule)
    }
  }
}

// 获取"日"数组-少量为日期规则
function getDayArr(rule: string) {
  dateArr.value[3] = getOrderArr(1, 31)
  dayRule.value = ''
  dayRuleSup.value = ''
  if (rule.includes('-')) {
    dateArr.value[3] = getCycleArr(rule, 31, false)
    dayRuleSup.value = 'null'
  }
  else if (rule.includes('/')) {
    dateArr.value[3] = getAverageArr(rule, 31)
    dayRuleSup.value = 'null'
  }
  else if (rule.includes('W')) {
    dayRule.value = 'workDay'
    const _rule = rule.match(/\d{1,2}/g)
    if (_rule) {
      dayRuleSup.value = Number(_rule[0])
    }
    dateArr.value[3] = [dayRuleSup.value]
  }
  else if (rule.includes('L')) {
    dayRule.value = 'lastDay'
    dayRuleSup.value = 'null'
    dateArr.value[3] = [31]
  }
  else if (rule !== '*' && rule !== '?') {
    dateArr.value[3] = getAssignArr(rule)
    dayRuleSup.value = 'null'
  }
  else if (rule === '*') {
    dayRuleSup.value = 'null'
  }
}
// 获取"时"数组
function getHourArr(rule: string) {
  dateArr.value[2] = getOrderArr(0, 23)
  if (rule.includes('-')) {
    dateArr.value[2] = getCycleArr(rule, 24, true)
  }
  else if (rule.includes('/')) {
    dateArr.value[2] = getAverageArr(rule, 23)
  }
  else if (rule !== '*') {
    dateArr.value[2] = getAssignArr(rule)
  }
}
// 获取"分"数组
function getMinArr(rule: string) {
  dateArr.value[1] = getOrderArr(0, 59)
  if (rule.includes('-')) {
    dateArr.value[1] = getCycleArr(rule, 60, true)
  }
  else if (rule.includes('/')) {
    dateArr.value[1] = getAverageArr(rule, 59)
  }
  else if (rule !== '*') {
    dateArr.value[1] = getAssignArr(rule)
  }
}
// 获取"秒"数组
function getSecondArr(rule: string) {
  dateArr.value[0] = getOrderArr(0, 59)
  if (rule.includes('-')) {
    dateArr.value[0] = getCycleArr(rule, 60, true)
  }
  else if (rule.includes('/')) {
    dateArr.value[0] = getAverageArr(rule, 59)
  }
  else if (rule !== '*') {
    dateArr.value[0] = getAssignArr(rule)
  }
}
// 根据传进来的min-max返回一个顺序的数组
function getOrderArr(min: number, max: number) {
  const arr = []
  for (let i = min; i <= max; i++) {
    arr.push(i)
  }
  return arr
}
// 根据规则中指定的零散值返回一个数组
function getAssignArr(rule: string) {
  const arr = []
  const assiginArr = rule.split(',')
  for (let i = 0; i < assiginArr.length; i++) {
    arr[i] = Number(assiginArr[i])
  }
  arr.sort(compare)
  return arr
}
// 根据一定算术规则计算返回一个数组
function getAverageArr(rule: string, limit: number) {
  const arr = []
  const agArr = rule.split('/')
  let min = Number(agArr[0])
  const step = Number(agArr[1])
  while (min <= limit) {
    arr.push(min)
    min += step
  }
  return arr
}
// 根据规则返回一个具有周期性的数组
function getCycleArr(rule: string, limit: number, status: boolean) {
  // status--表示是否从0开始（则从1开始）
  const arr = []
  const cycleArr = rule.split('-')
  const min = Number(cycleArr[0])
  let max = Number(cycleArr[1])
  if (min > max) {
    max += limit
  }
  for (let i = min; i <= max; i++) {
    let add = 0
    if (status === false && i % limit === 0) {
      add = limit
    }
    arr.push(Math.round(i % limit + add))
  }
  arr.sort(compare)
  return arr
}

// 比较数字大小（用于Array.sort）
function compare(value1: number, value2: number) {
  if (value2 - value1 > 0) {
    return -1
  }
  else {
    return 1
  }
}
// 格式化日期格式如：2017-9-19 18:04:33
function formatDate(value: number | Date, type?: string) {
  // 计算日期相关值
  const time = typeof value == 'number' ? new Date(value) : value
  const Y = time.getFullYear()
  const M = time.getMonth() + 1
  const D = time.getDate()
  const h = time.getHours()
  const m = time.getMinutes()
  const s = time.getSeconds()
  const week = time.getDay()
  // 如果传递了type的话
  if (type === undefined) {
    return `${Y}-${M < 10 ? `0${M}` : M}-${D < 10 ? `0${D}` : D} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }
  else if (type === 'week') {
    // 在quartz中 1为星期日
    return week + 1
  }
}

// 检查日期是否存在
function checkDate(value: string): boolean {
  const time = new Date(value)
  const format = formatDate(time)
  return value === format
}
onMounted(() => {
  expressionChange()
})
</script>

<template>
  <div class="popup-result">
    <p class="title">
      最近5次运行时间
    </p>
    <ul class="popup-result-scroll">
      <template v-if="isShow">
        <li v-for="item in resultList" :key="item">
          {{ item }}
        </li>
      </template>
      <li v-else>
        计算结果中...
      </li>
    </ul>
  </div>
</template>
