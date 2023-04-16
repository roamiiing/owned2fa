import { createRouter, createWebHistory } from 'vue-router'
import ListPage from '@/pages/list-page.vue'
import AddPage from '@/pages/add-page.vue'
import EditPage from '@/pages/edit-page.vue'

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
      component: AddPage,
    },
    {
      path: '/:id',
      name: 'edit',
      component: EditPage,
    },
  ],
})

export default router
