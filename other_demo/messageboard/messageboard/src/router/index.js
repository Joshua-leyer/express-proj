import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/index',
      name: 'Index',
      component: () => import('../components/index.vue')
    },
    {
      path: '/board',
      name: 'Board',
      component: () => import('../components/view/board.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/view/login')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/view/register')
    },
    {
      path: '/findPwd',
      name: 'FindPwd',
      component: () => import('../components/view/findPwd')
    },
    {
      path: '*',
      redirect: { name: 'Index' }
    }
  ]
})
