/**
 * 一些公用方法
 */
let commonPlugin = {}
commonPlugin.install = function (Vue, options) {
  Vue.prototype.$host = function () {
    return window.location.protocol + '//' + window.location.host
  }
}
export default commonPlugin
