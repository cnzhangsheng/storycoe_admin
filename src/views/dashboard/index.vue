<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="用户总数"
            :value="stats.total_users"
            :value-style="{ color: '#2563eb' }"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="绘本总数"
            :value="stats.total_books"
            :value-style="{ color: '#22c55e' }"
          >
            <template #prefix>
              <BookOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="今日新用户"
            :value="stats.new_users_today"
            :value-style="{ color: '#f59e0b' }"
          >
            <template #prefix>
              <UserAddOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="今日阅读量"
            :value="stats.readings_today"
            :value-style="{ color: '#ef4444' }"
          >
            <template #prefix>
              <EyeOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-card title="快捷操作" class="quick-actions" style="margin-top: 24px">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card hoverable class="action-card" @click="router.push('/users')">
            <template #cover>
              <div class="action-cover" style="background: #2563eb">
                <UserOutlined />
              </div>
            </template>
            <a-card-meta title="用户管理" description="管理用户账户" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card hoverable class="action-card" @click="router.push('/books')">
            <template #cover>
              <div class="action-cover" style="background: #22c55e">
                <BookOutlined />
              </div>
            </template>
            <a-card-meta title="绘本管理" description="审核和管理绘本" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card hoverable class="action-card" @click="router.push('/stats')">
            <template #cover>
              <div class="action-cover" style="background: #f59e0b">
                <BarChartOutlined />
              </div>
            </template>
            <a-card-meta title="数据统计" description="查看运营数据" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card hoverable class="action-card" @click="router.push('/config')">
            <template #cover>
              <div class="action-cover" style="background: #64748b">
                <SettingOutlined />
              </div>
            </template>
            <a-card-meta title="系统配置" description="管理系统设置" />
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminStatsApi, type StatsOverview } from '@/api/admin/stats'
import {
  UserOutlined,
  BookOutlined,
  UserAddOutlined,
  EyeOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()

const stats = ref<StatsOverview>({
  total_users: 0,
  total_books: 0,
  new_users_today: 0,
  new_books_today: 0,
  readings_today: 0,
})

const loading = ref(false)

async function loadStats() {
  loading.value = true
  try {
    const res = await adminStatsApi.getOverview()
    stats.value = res
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style lang="less" scoped>
.dashboard-page {
  .stat-card {
    text-align: center;
    border-radius: 12px;

    :deep(.ant-statistic-title) {
      font-size: 14px;
    }

    :deep(.ant-statistic-content) {
      font-size: 28px;
    }
  }

  .quick-actions {
    .action-card {
      border-radius: 12px;
      cursor: pointer;

      .action-cover {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: #fff;
      }
    }
  }
}
</style>