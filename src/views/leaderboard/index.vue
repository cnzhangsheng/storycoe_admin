<template>
  <div class="leaderboard-page">
    <!-- Tab 切换 -->
    <a-tabs v-model:activeKey="activeTab">
      <!-- 绘本排行榜 -->
      <a-tab-pane key="books" tab="绘本榜">
        <!-- 工具栏 -->
        <a-row :gutter="16" style="margin-bottom: 16px">
          <a-col :span="8">
            <a-input-search
              v-model:value="bookSearch"
              placeholder="搜索绘本标题"
              @search="loadBooks"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model:value="bookSortBy" style="width: 100%" @change="loadBooks">
              <a-select-option value="score">综合排序</a-select-option>
              <a-select-option value="read_count">阅读数</a-select-option>
              <a-select-option value="shelf_count">收藏数</a-select-option>
              <a-select-option value="created_at">创建时间</a-select-option>
            </a-select>
          </a-col>
        </a-row>

        <!-- 绘本表格 -->
        <a-table
          :columns="bookColumns"
          :data-source="books"
          :loading="booksLoading"
          :pagination="bookPagination"
          row-key="id"
          @change="handleBookTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'rank'">
              <a-tag :color="index < 3 ? 'gold' : 'default'">
                #{{ (bookPagination.current - 1) * 20 + index + 1 }}
              </a-tag>
            </template>
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
            <template v-if="column.key === 'score'">
              <span style="font-weight: bold">{{ record.score }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" size="small" @click="showEditBookModal(record)">
                编辑
              </a-button>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- 作者排行榜 -->
      <a-tab-pane key="authors" tab="作者榜">
        <!-- 工具栏 -->
        <a-row :gutter="16" style="margin-bottom: 16px">
          <a-col :span="8">
            <a-input-search
              v-model:value="authorSearch"
              placeholder="搜索作者名称"
              @search="loadAuthors"
            />
          </a-col>
          <a-col :span="4">
            <a-select v-model:value="authorSortBy" style="width: 100%" @change="loadAuthors">
              <a-select-option value="score">综合排序</a-select-option>
              <a-select-option value="books_created">创作数</a-select-option>
              <a-select-option value="stars">星星数</a-select-option>
              <a-select-option value="created_at">注册时间</a-select-option>
            </a-select>
          </a-col>
        </a-row>

        <!-- 作者表格 -->
        <a-table
          :columns="authorColumns"
          :data-source="authors"
          :loading="authorsLoading"
          :pagination="authorPagination"
          row-key="id"
          @change="handleAuthorTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'rank'">
              <a-tag :color="index < 3 ? 'gold' : 'default'">
                #{{ (authorPagination.current - 1) * 20 + index + 1 }}
              </a-tag>
            </template>
            <template v-if="column.key === 'author'">
              <a-space>
                <a-avatar :src="record.avatar" style="background-color: #2563eb">
                  {{ record.name?.substring(0, 1) }}
                </a-avatar>
                <span>{{ record.name }}</span>
              </a-space>
            </template>
            <template v-if="column.key === 'level'">
              Lv.{{ record.level }}
            </template>
            <template v-if="column.key === 'score'">
              <span style="font-weight: bold">{{ record.score }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" size="small" @click="showEditAuthorModal(record)">
                编辑
              </a-button>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <!-- 编辑绘本统计弹窗 -->
    <a-modal
      v-model:open="editBookModalVisible"
      title="编辑绘本统计数据"
      @ok="handleUpdateBookStats"
    >
      <a-form layout="vertical">
        <a-form-item label="阅读次数">
          <a-input-number v-model:value="editBookReadCount" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="收藏次数">
          <a-input-number v-model:value="editBookShelfCount" :min="0" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑作者统计弹窗 -->
    <a-modal
      v-model:open="editAuthorModalVisible"
      title="编辑作者统计数据"
      @ok="handleUpdateAuthorStats"
    >
      <a-form layout="vertical">
        <a-form-item label="创作绘本数">
          <a-input-number v-model:value="editAuthorBooksCreated" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="星星数">
          <a-input-number v-model:value="editAuthorStars" :min="0" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { adminLeaderboardApi, type LeaderboardBook, type LeaderboardAuthor } from '@/api/admin/leaderboard'
import { message } from 'ant-design-vue'

const activeTab = ref('books')

// 绘本榜状态
const books = ref<LeaderboardBook[]>([])
const booksLoading = ref(false)
const bookSearch = ref('')
const bookSortBy = ref('score')
const bookPagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: false,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 作者榜状态
const authors = ref<LeaderboardAuthor[]>([])
const authorsLoading = ref(false)
const authorSearch = ref('')
const authorSortBy = ref('score')
const authorPagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: false,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 弹窗状态
const editBookModalVisible = ref(false)
const selectedBook = ref<LeaderboardBook | null>(null)
const editBookReadCount = ref(0)
const editBookShelfCount = ref(0)

const editAuthorModalVisible = ref(false)
const selectedAuthor = ref<LeaderboardAuthor | null>(null)
const editAuthorBooksCreated = ref(0)
const editAuthorStars = ref(0)

// 表格列定义
const bookColumns = [
  { title: '排名', key: 'rank', width: 80 },
  { title: '绘本', key: 'title' },
  { title: '作者', dataIndex: 'author_name', key: 'author_name' },
  { title: '阅读数', dataIndex: 'read_count', key: 'read_count' },
  { title: '收藏数', dataIndex: 'shelf_count', key: 'shelf_count' },
  { title: '综合分数', key: 'score' },
  { title: '操作', key: 'action', width: 100 },
]

const authorColumns = [
  { title: '排名', key: 'rank', width: 80 },
  { title: '作者', key: 'author' },
  { title: '等级', key: 'level' },
  { title: '创作数', dataIndex: 'books_created', key: 'books_created' },
  { title: '星星', dataIndex: 'stars', key: 'stars' },
  { title: '作品被收藏', dataIndex: 'total_shelf_count', key: 'total_shelf_count' },
  { title: '综合分数', key: 'score' },
  { title: '操作', key: 'action', width: 100 },
]

// 加载绘本榜
async function loadBooks() {
  booksLoading.value = true
  try {
    const res = await adminLeaderboardApi.getBooks({
      page: bookPagination.current,
      page_size: bookPagination.pageSize,
      search: bookSearch.value || undefined,
      sort_by: bookSortBy.value as any,
    })
    books.value = res.books
    bookPagination.total = res.total
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    booksLoading.value = false
  }
}

// 加载作者榜
async function loadAuthors() {
  authorsLoading.value = true
  try {
    const res = await adminLeaderboardApi.getAuthors({
      page: authorPagination.current,
      page_size: authorPagination.pageSize,
      search: authorSearch.value || undefined,
      sort_by: authorSortBy.value as any,
    })
    authors.value = res.authors
    authorPagination.total = res.total
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    authorsLoading.value = false
  }
}

// 分页处理
function handleBookTableChange(page: any) {
  bookPagination.current = page.current
  loadBooks()
}

function handleAuthorTableChange(page: any) {
  authorPagination.current = page.current
  loadAuthors()
}

// 编辑弹窗
function showEditBookModal(book: LeaderboardBook) {
  selectedBook.value = book
  editBookReadCount.value = book.read_count
  editBookShelfCount.value = book.shelf_count
  editBookModalVisible.value = true
}

function showEditAuthorModal(author: LeaderboardAuthor) {
  selectedAuthor.value = author
  editAuthorBooksCreated.value = author.books_created
  editAuthorStars.value = author.stars
  editAuthorModalVisible.value = true
}

// 更新统计
async function handleUpdateBookStats() {
  if (!selectedBook.value) return

  try {
    await adminLeaderboardApi.updateBookStats(selectedBook.value.id, {
      read_count: editBookReadCount.value,
      shelf_count: editBookShelfCount.value,
    })
    message.success('统计数据已更新')
    editBookModalVisible.value = false
    loadBooks()
  } catch (error: any) {
    message.error(error.message || '更新失败')
  }
}

async function handleUpdateAuthorStats() {
  if (!selectedAuthor.value) return

  try {
    await adminLeaderboardApi.updateAuthorStats(selectedAuthor.value.id, {
      books_created: editAuthorBooksCreated.value,
      stars: editAuthorStars.value,
    })
    message.success('统计数据已更新')
    editAuthorModalVisible.value = false
    loadAuthors()
  } catch (error: any) {
    message.error(error.message || '更新失败')
  }
}

onMounted(() => {
  loadBooks()
  loadAuthors()
})
</script>

<style lang="less" scoped>
.leaderboard-page {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
}
</style>