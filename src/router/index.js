import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import h265webjsTest from '@/pages/videoPlay/h265webjs.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'h265webjsTest'}
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/h265webjsTest',
      name: 'h265webjsTest',
      component: h265webjsTest
    }
  ]
})
