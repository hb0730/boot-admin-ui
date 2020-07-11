import ElxImgManager from './ElxImgManager'

const ElxImgboxPlugin = {
  install(Vue) {
    const CONSTRUCTOR = Vue.extend(ElxImgManager);

    // 定义插件
    Vue.elxImgbox = Vue.prototype.$elxImgbox = function(options = {}, selectedImgs = []) {
      let imgbox = new CONSTRUCTOR;

      imgbox.images = JSON.parse(JSON.stringify(selectedImgs))
      imgbox.setOptions(options)

      if (!imgbox.$el) {
        let vm = imgbox.$mount();
        document.querySelector('body').appendChild(vm.$el);
      }

      imgbox.show();

      return imgbox;
    }
  }
}

export default ElxImgboxPlugin;