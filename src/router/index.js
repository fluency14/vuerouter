import Vue from 'vue'
// import Router from 'vue-router'
import Router from '../myRouter/index'
import HelloWorld from '@/components/HelloWorld'
import test from '@/components/test'
import hello from '@/components/hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/world',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/aaaa',
      name: 'test',
      component: test
    },
    {
      path: '/hello',
      name: 'hello',
      component: hello
    },
    {
      path: '/bbb',
      name: 'hello',
      component: hello
    }
  ]
})
