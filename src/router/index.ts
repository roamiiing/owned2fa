import { createRouter, createWebHistory } from 'vue-router'
import ListPage from '@/pages/list-page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListPage,
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('@/pages/add-page.vue'),
    },
    {
      path: '/:id',
      name: 'edit',
      component: () => import('@/pages/edit-page.vue'),
    },
  ],
})

export default router
