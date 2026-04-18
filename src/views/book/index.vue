<template>
  <div class="book-page">
    <!-- 搜索和筛选 -->
    <a-card class="toolbar-card">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-input-search
            v-model:value="search"
            placeholder="搜索绘本标题"
            allow-clear
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="filterStatus"
            placeholder="状态筛选"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option :value="undefined">全部状态</a-select-option>
            <a-select-option value="draft">草稿</a-select-option>
            <a-select-option value="generating">生成中</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="error">错误</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="filterShareType"
            placeholder="分享类型"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option :value="undefined">全部类型</a-select-option>
            <a-select-option value="public">公开</a-select-option>
            <a-select-option value="private">私有</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-card>

    <!-- 绘本表格 -->
    <a-card style="margin-top: 16px">
      <a-table
        :columns="columns"
        :data-source="books"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 标题列 -->
          <template v-if="column.key === 'title'">
            <a-space>
              <a-image
                v-if="record.cover_image"
                :src="record.cover_image"
                :width="40"
                :height="40"
                style="object-fit: cover; border-radius: 4px"
              />
              <span>{{ record.title }}</span>
            </a-space>
          </template>

          <!-- 状态列 -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <!-- 分享类型列 -->
          <template v-if="column.key === 'share_type'">
            <a-tag :color="record.share_type === 'public' ? 'green' : 'orange'">
              {{ record.share_type === 'public' ? '公开' : '私有' }}
            </a-tag>
          </template>

          <!-- 进度列 -->
          <template v-if="column.key === 'progress'">
            <a-progress :percent="record.progress" size="small" />
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="goDetail(record)">
                详情
              </a-button>
              <a-button
                type="link"
                size="small"
                @click="handleToggleShareType(record)"
              >
                {{ record.share_type === 'public' ? '设为私有' : '设为公开' }}
              </a-button>
              <a-button
                v-if="record.status === 'draft' || record.status === 'error'"
                type="link"
                size="small"
                @click="handleUpdateStatus(record, 'completed')"
              >
                完成
              </a-button>
              <a-button
                v-if="record.status === 'completed'"
                type="link"
                size="small"
                @click="handleUpdateStatus(record, 'draft')"
              >
                下架
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminBookApi, type BookItem } from '@/api/admin/book'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()

// 表格列定义
const columns = [
  { title: '绘本', key: 'title' },
  { title: '作者', dataIndex: 'user_name', key: 'user_name' },
  { title: '状态', key: 'status' },
  { title: '分享类型', key: 'share_type' },
  { title: '进度', key: 'progress', width: 120 },
  { title: '等级', dataIndex: 'level', key: 'level', customRender: ({ text }) => `Lv.${text}` },
  { title: '阅读数', dataIndex: 'read_count', key: 'read_count', customRender: ({ text }) => text || 0 },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at', customRender: ({ text }) => formatDate(text) },
  { title: '操作', key: 'action', width: 280 },
]

// 状态
const books = ref<BookItem[]>([])
const loading = ref(false)
const search = ref('')
const filterStatus = ref<string | undefined>(undefined)
const filterShareType = ref<string | undefined>(undefined)

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: false,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 加载绘本列表
async function loadBooks() {
  loading.value = true
  try {
    const res = await adminBookApi.getList({
      page: pagination.current,
      page_size: pagination.pageSize,
      search: search.value || undefined,
      status: filterStatus.value,
      share_type: filterShareType.value,
    })
    books.value = res.books
    pagination.total = res.total
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.current = 1
  loadBooks()
}

// 分页变化
function handleTableChange(page: any) {
  pagination.current = page.current
  loadBooks()
}

// 跳转详情
function goDetail(book: BookItem) {
  router.push(`/books/${book.id}`)
}

// 切换分享类型
async function handleToggleShareType(book: BookItem) {
  const newShareType = book.share_type === 'public' ? 'private' : 'public'
  const actionText = newShareType === 'public' ? '公开' : '私有'

  Modal.confirm({
    title: '更改分享类型',
    content: `确定要将绘本「${book.title}」设为${actionText}吗？`,
    async onOk() {
      try {
        await adminBookApi.updateShareType(book.id, newShareType)
        message.success(`已设为${actionText}`)
        loadBooks()
      } catch (error: any) {
        message.error(error.message || '操作失败')
      }
    },
  })
}

// 更新状态
async function handleUpdateStatus(book: BookItem, status: string) {
  try {
    await adminBookApi.updateStatus(book.id, status)
    message.success('状态已更新')
    loadBooks()
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

// 删除绘本
function handleDelete(book: BookItem) {
  Modal.confirm({
    title: '删除绘本',
    content: `确定要删除绘本「${book.title}」吗？此操作不可恢复。`,
    okType: 'danger',
    async onOk() {
      try {
        await adminBookApi.delete(book.id)
        message.success('绘本已删除')
        loadBooks()
      } catch (error: any) {
        message.error(error.message || '操作失败')
      }
    },
  })
}

// 获取状态颜色
function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'success'
    case 'generating': return 'processing'
    case 'error': return 'error'
    default: return 'default'
  }
}

// 获取状态文字
function getStatusText(status: string): string {
  switch (status) {
    case 'completed': return '已完成'
    case 'generating': return '生成中'
    case 'error': return '错误'
    default: return '草稿'
  }
}

// 格式化日期
function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    return dateStr.substring(0, 10)
  } catch {
    return dateStr
  }
}

onMounted(() => {
  loadBooks()
})
</script>

<style lang="less" scoped>
.book-page {
  .toolbar-card {
    border-radius: 12px;
  }
}
</style>