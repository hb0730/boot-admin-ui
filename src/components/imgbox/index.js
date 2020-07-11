import Vue from 'vue'
import ElxImgbox from './ElxImgbox'
import ElxImgboxPlugin from './ElxImgboxPlugin'

Vue.component(ElxImgbox.name, ElxImgbox)

// 自动启用插件
Vue.use(ElxImgboxPlugin);

export default ElxImgbox