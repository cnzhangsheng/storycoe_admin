import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'DashboardOutlined' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'UserOutlined' },
      },
      {
        path: 'books',
        name: 'Books',
        component: () => import('@/views/book/index.vue'),
        meta: { title: '绘本管理', icon: 'BookOutlined' },
      },
      {
        path: 'books/:id',
        name: 'BookDetail',
        component: () => import('@/views/book/detail.vue'),
        meta: { title: '绘本详情', hidden: true },
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('@/views/stats/index.vue'),
        meta: { title: '数据统计', icon: 'BarChartOutlined' },
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/config/index.vue'),
        meta: { title: '系统配置', icon: 'SettingOutlined' },
      },
      {
        path: 'leaderboard',
        name: 'Leaderboard',
        component: () => import('@/views/leaderboard/index.vue'),
        meta: { title: '排行榜管理', icon: 'TrophyOutlined' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  document.title = `${to.meta.title || '后台管理'} - StoryCoe Admin`

  // 检查认证
  if (to.meta.requiresAuth !== false && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && userStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router