import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import WorkWave from '@/components/WorkWave'
import SimpleEdit from '@/components/SimpleEdit'
import resultsPage from '@/components/resultsPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/workwave',
      name: 'workwave',
      component: WorkWave
    },
    {path: '/simple',
      name: 'simple',
      component: SimpleEdit
     }, 
     {
      path: '/results',
      name: 'results',
      component: resultsPage
    },
  ]
})
