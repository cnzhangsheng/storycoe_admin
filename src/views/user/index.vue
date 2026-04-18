<template>
  <div class="user-page">
    <!-- 搜索和筛选 -->
    <a-card class="toolbar-card">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-input-search
            v-model:value="search"
            placeholder="搜索用户名或手机号"
            allow-clear
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="filterBanned"
            placeholder="状态筛选"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option :value="undefined">全部状态</a-select-option>
            <a-select-option :value="false">正常</a-select-option>
            <a-select-option :value="true">已封禁</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-card>

    <!-- 用户表格 -->
    <a-card style="margin-top: 16px">
      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <!-- 用户列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <a-space>
              <a-avatar :src="record.avatar" style="background-color: #2563eb">
                {{ record.name?.substring(0, 1) }}
              </a-avatar>
              <span>{{ record.name }}</span>
            </a-space>
          </template>

          <!-- 角色列 -->
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ record.role_name }}
            </a-tag>
          </template>

          <!-- 状态列 -->
          <template v-if="column.key === 'status'">
            <a-tag :color="record.is_banned ? 'error' : 'success'">
              {{ record.is_banned ? '已封禁' : '正常' }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showRoleModal(record)">
                角色
              </a-button>
              <a-button
                v-if="record.is_banned"
                type="link"
                size="small"
                @click="handleUnban(record)"
              >
                解封
              </a-button>
              <a-button
                v-else
                type="link"
                size="small"
                danger
                @click="showBanModal(record)"
              >
                封禁
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 修改角色弹窗 -->
    <a-modal
      v-model:open="roleModalVisible"
      title="修改用户角色"
      @ok="handleUpdateRole"
    >
      <a-radio-group v-model:value="selectedRole">
        <a-radio :value="0">普通用户</a-radio>
        <a-radio :value="1">高级用户</a-radio>
        <a-radio :value="10">管理员</a-radio>
      </a-radio-group>
    </a-modal>

    <!-- 封禁弹窗 -->
    <a-modal
      v-model:open="banModalVisible"
      title="封禁用户"
      @ok="handleBan"
    >
      <a-form layout="vertical">
        <a-form-item label="封禁原因">
          <a-input v-model:value="banReason" placeholder="请输入封禁原因" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { adminUserApi, type UserItem } from '@/api/admin/user'
import { message, Modal } from 'ant-design-vue'

// 表格列定义
const columns = [
  { title: '用户', key: 'user' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '角色', key: 'role' },
  { title: '等级', dataIndex: 'level', key: 'level', customRender: ({ text }) => `Lv.${text}` },
  { title: '阅读数', dataIndex: 'books_read', key: 'books_read' },
  { title: '状态', key: 'status' },
  { title: '注册时间', dataIndex: 'created_at', key: 'created_at', customRender: ({ text }) => formatDate(text) },
  { title: '操作', key: 'action', width: 200 },
]

// 状态
const users = ref<UserItem[]>([])
const loading = ref(false)
const search = ref('')
const filterBanned = ref<boolean | undefined>(undefined)

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: false,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 弹窗状态
const roleModalVisible = ref(false)
const selectedUser = ref<UserItem | null>(null)
const selectedRole = ref(0)

const banModalVisible = ref(false)
const banReason = ref('')

// 加载用户列表
async function loadUsers() {
  loading.value = true
  try {
    const res = await adminUserApi.getList({
      page: pagination.current,
      page_size: pagination.pageSize,
      search: search.value || undefined,
      is_banned: filterBanned.value,
    })
    users.value = res.users
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
  loadUsers()
}

// 分页变化
function handleTableChange(page: any) {
  pagination.current = page.current
  loadUsers()
}

// 显示角色弹窗
function showRoleModal(user: UserItem) {
  selectedUser.value = user
  selectedRole.value = user.role
  roleModalVisible.value = true
}

// 更新角色
async function handleUpdateRole() {
  if (!selectedUser.value) return

  try {
    await adminUserApi.updateRole(selectedUser.value.id, { role: selectedRole.value })
    message.success('角色已更新')
    roleModalVisible.value = false
    loadUsers()
  } catch (error: any) {
    message.error(error.message || '更新失败')
  }
}

// 显示封禁弹窗
function showBanModal(user: UserItem) {
  selectedUser.value = user
  banReason.value = ''
  banModalVisible.value = true
}

// 封禁用户
async function handleBan() {
  if (!selectedUser.value || !banReason.value.trim()) {
    message.warning('请输入封禁原因')
    return
  }

  try {
    await adminUserApi.ban(selectedUser.value.id, { reason: banReason.value.trim() })
    message.success('用户已封禁')
    banModalVisible.value = false
    loadUsers()
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

// 解封用户
async function handleUnban(user: UserItem) {
  Modal.confirm({
    title: '解封用户',
    content: `确定要解封用户 ${user.name} 吗？`,
    async onOk() {
      try {
        await adminUserApi.unban(user.id)
        message.success('用户已解封')
        loadUsers()
      } catch (error: any) {
        message.error(error.message || '操作失败')
      }
    },
  })
}

// 删除用户
function handleDelete(user: UserItem) {
  Modal.confirm({
    title: '删除用户',
    content: `确定要删除用户 ${user.name} 吗？此操作不可恢复。`,
    okType: 'danger',
    async onOk() {
      try {
        await adminUserApi.delete(user.id)
        message.success('用户已删除')
        loadUsers()
      } catch (error: any) {
        message.error(error.message || '操作失败')
      }
    },
  })
}

// 获取角色颜色
function getRoleColor(role: number): string {
  if (role >= 10) return 'error' // 管理员
  if (role >= 1) return 'processing' // 高级用户
  return 'default' // 普通用户
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
  loadUsers()
})
</script>

<style lang="less" scoped>
.user-page {
  .toolbar-card {
    border-radius: 12px;
  }
}
</style>