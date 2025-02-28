import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/berries',
    },
    {
      path: '/berries',
      name: 'berries',
      component: () => import('../views/Berries.vue'),
      meta: { activeNav: 'berries' },
    },
    {
      path: '/detail-berry/:id',
      name: 'berry',
      component: () => import('../views/DetailBerry.vue'),
      meta: { activeNav: 'berries' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/Products.vue'),
      meta: { activeNav: 'products' },
    },
    {
      path: '/create-product',
      name: 'create-product',
      component: () => import('../views/CreateProduct.vue'),
      meta: { activeNav: 'products' },
    },
    {
      path: '/edit-product/:id',
      name: 'edit-product',
      component: () => import('../views/EditProduct.vue'),
      meta: { activeNav: 'products' },
      props: true,
    },
  ],
})

export default router
