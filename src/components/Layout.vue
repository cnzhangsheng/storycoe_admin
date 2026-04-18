<template>
  <a-layout class="admin-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="250"
      :collapsed-width="80"
      theme="dark"
      class="admin-sider"
    >
      <!-- Logo -->
      <div class="logo">
        <BookOutlined />
        <span v-if="!collapsed">StoryCoe Admin</span>
      </div>

      <!-- 菜单 -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout>
      <!-- 顶部栏 -->
      <a-layout-header class="admin-header">
        <div class="header-left">
          <MenuFoldOutlined v-if="!collapsed" @click="collapsed = true" />
          <MenuUnfoldOutlined v-else @click="collapsed = false" />
          <span class="header-title">{{ currentTitle }}</span>
        </div>

        <div class="header-right">
          <a-dropdown>
            <a-space class="user-info">
              <a-avatar size="small" style="background-color: #2563eb">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span>admin</span>
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  BookOutlined,
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  TrophyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

// 菜单配置
const menuItems = computed(() => [
  {
    key: 'dashboard',
    icon: () => h(DashboardOutlined),
    label: '仪表盘',
  },
  {
    key: 'users',
    icon: () => h(UserOutlined),
    label: '用户管理',
  },
  {
    key: 'books',
    icon: () => h(BookOutlined),
    label: '绘本管理',
  },
  {
    key: 'stats',
    icon: () => h(BarChartOutlined),
    label: '数据统计',
  },
  {
    key: 'leaderboard',
    icon: () => h(TrophyOutlined),
    label: '排行榜管理',
  },
  {
    key: 'config',
    icon: () => h(SettingOutlined),
    label: '系统配置',
  },
])

// 当前页面标题
const currentTitle = computed(() => route.meta.title || '后台管理')

// 监听路由变化更新选中菜单
watch(
  () => route.path,
  (path) => {
    const key = path.split('/')[1] || 'dashboard'
    selectedKeys.value = [key]
  },
  { immediate: true }
)

// 菜单点击
function handleMenuClick({ key }: { key: string }) {
  router.push(`/${key}`)
}

// 退出登录
async function handleLogout() {
  await userStore.logout()
  router.push('/login')
}
</script>

<style lang="less" scoped>
.admin-layout {
  height: 100vh;
}

.admin-sider {
  background: #1e293b;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
}

.admin-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .anticon {
      font-size: 18px;
      cursor: pointer;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .header-right {
    .user-info {
      cursor: pointer;
    }
  }
}

.admin-content {
  background: #f5f5f5;
  padding: 24px;
  overflow: auto;
}
</style>