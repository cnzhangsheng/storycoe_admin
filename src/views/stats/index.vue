<template>
  <div class="stats-page">
    <!-- 用户统计 -->
    <a-card title="近7日新增用户" style="margin-bottom: 24px">
      <div ref="userChartRef" style="height: 300px"></div>
    </a-card>

    <!-- 绘本统计 -->
    <a-card title="近7日新增绘本">
      <div ref="bookChartRef" style="height: 300px"></div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { adminStatsApi, type DailyStat } from '@/api/admin/stats'
import { message } from 'ant-design-vue'

const userChartRef = ref<HTMLElement>()
const bookChartRef = ref<HTMLElement>()

let userChart: echarts.ECharts | null = null
let bookChart: echarts.ECharts | null = null

// 加载统计数据并渲染图表
async function loadStats() {
  try {
    const [users, books] = await Promise.all([
      adminStatsApi.getDailyUsers(7),
      adminStatsApi.getDailyBooks(7),
    ])

    renderChart(userChart, users, '#2563eb')
    renderChart(bookChart, books, '#22c55e')
  } catch (error: any) {
    message.error(error.message || '加载失败')
  }
}

// 渲染图表
function renderChart(chart: echarts.ECharts | null, data: DailyStat[], color: string) {
  if (!chart) return

  const dates = data.map(d => d.date.substring(5)) // MM-DD
  const counts = data.map(d => d.count)

  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: counts,
        type: 'bar',
        itemStyle: {
          color,
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  })
}

onMounted(() => {
  // 初始化图表
  if (userChartRef.value) {
    userChart = echarts.init(userChartRef.value)
  }
  if (bookChartRef.value) {
    bookChart = echarts.init(bookChartRef.value)
  }

  loadStats()
})
</script>

<style lang="less" scoped>
.stats-page {
  :deep(.ant-card) {
    border-radius: 12px;
  }
}
</style>