<template>
  <div class="book-detail-page">
    <!-- 返回按钮 -->
    <a-button type="link" @click="router.push('/books')">
      <ArrowLeftOutlined />
      返回绘本列表
    </a-button>

    <!-- 基本信息 -->
    <a-card style="margin-top: 16px" :loading="loading">
      <a-descriptions title="绘本信息" bordered :column="3">
        <a-descriptions-item label="标题">{{ book?.title }}</a-descriptions-item>
        <a-descriptions-item label="作者">{{ book?.user_name }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(book?.status || '')">{{ getStatusText(book?.status || '') }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="等级">Lv.{{ book?.level }}</a-descriptions-item>
        <a-descriptions-item label="进度">{{ book?.progress }}%</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ formatDate(book?.created_at) }}</a-descriptions-item>
      </a-descriptions>

      <!-- 封面图片 -->
      <div v-if="book?.cover_image" style="margin-top: 16px">
        <a-image :src="book?.cover_image" :width="200" style="border-radius: 8px" />
      </div>
    </a-card>

    <!-- 页面列表 -->
    <a-card title="页面内容" style="margin-top: 16px" v-if="book?.pages?.length">
      <a-tabs v-model:activeKey="activePage">
        <a-tab-pane
          v-for="(page, index) in book?.pages"
          :key="String(index)"
          :tab="`第 ${index + 1} 页`"
        >
          <!-- 页面图片 -->
          <div v-if="page.image_url" style="margin-bottom: 16px">
            <a-image :src="page.image_url" :width="400" style="border-radius: 8px" />
          </div>

          <!-- 句子列表 -->
          <a-table
            :columns="sentenceColumns"
            :data-source="page.sentences"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'order'">
                <a-tag color="blue">#{{ record.sentence_order }}</a-tag>
              </template>
              <template v-if="column.key === 'audio'">
                <a-tag v-if="record.audio_url" color="success">有音频</a-tag>
                <span v-else style="color: #999">无</span>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminBookApi, type BookDetail } from '@/api/admin/book'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const book = ref<BookDetail | null>(null)
const loading = ref(false)
const activePage = ref('0')

// 句子表格列
const sentenceColumns = [
  { title: '序号', key: 'order', width: 80 },
  { title: '英文', dataIndex: 'en', key: 'en' },
  { title: '中文', dataIndex: 'zh', key: 'zh' },
  { title: '音频', key: 'audio', width: 100 },
]

// 加载绘本详情
async function loadDetail() {
  const bookId = route.params.id as string
  loading.value = true
  try {
    const res = await adminBookApi.getDetail(bookId)
    book.value = res
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 状态颜色
function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'success'
    case 'generating': return 'processing'
    case 'error': return 'error'
    default: return 'default'
  }
}

// 状态文字
function getStatusText(status: string): string {
  switch (status) {
    case 'completed': return '已完成'
    case 'generating': return '生成中'
    case 'error': return '错误'
    default: return '草稿'
  }
}

// 格式化日期
function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  return dateStr.substring(0, 10)
}

onMounted(() => {
  loadDetail()
})
</script>

<style lang="less" scoped>
.book-detail-page {
  :deep(.ant-tabs-content) {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>