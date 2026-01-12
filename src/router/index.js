import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/venta'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/venta',
      name: 'venta',
      component: () => import('../views/VentaView.vue')
    },
    {
      path: '/principal',
      name: 'principal',
      redirect: '/venta'
    }
  ],
})

export default router
