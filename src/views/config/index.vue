<template>
  <div class="config-page">
    <a-card title="系统配置">
      <a-list
        :loading="loading"
        :data-source="configs"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-tag color="blue">{{ item.key }}</a-tag>
              </template>
              <template #description>
                <div style="margin-top: 8px">
                  <div style="font-size: 16px; color: #333">{{ item.value }}</div>
                  <div v-if="item.description" style="margin-top: 4px; color: #666">
                    {{ item.description }}
                  </div>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" @click="showEditModal(item)">
                <EditOutlined />
                编辑
              </a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑配置"
      @ok="handleUpdate"
    >
      <a-form layout="vertical">
        <a-form-item label="配置值">
          <a-textarea v-model:value="editValue" :rows="3" placeholder="请输入新的配置值" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import { adminConfigApi, type ConfigItem } from '@/api/admin/config'
import { message } from 'ant-design-vue'

const configs = ref<ConfigItem[]>([])
const loading = ref(false)

const editModalVisible = ref(false)
const selectedConfig = ref<ConfigItem | null>(null)
const editValue = ref('')

// 加载配置列表
async function loadConfigs() {
  loading.value = true
  try {
    const res = await adminConfigApi.getList()
    configs.value = res
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 显示编辑弹窗
function showEditModal(config: ConfigItem) {
  selectedConfig.value = config
  editValue.value = config.value
  editModalVisible.value = true
}

// 更新配置
async function handleUpdate() {
  if (!selectedConfig.value || !editValue.value.trim()) {
    message.warning('请输入配置值')
    return
  }

  try {
    await adminConfigApi.update(selectedConfig.value.key, { value: editValue.value.trim() })
    message.success('配置已更新')
    editModalVisible.value = false
    loadConfigs()
  } catch (error: any) {
    message.error(error.message || '更新失败')
  }
}

onMounted(() => {
  loadConfigs()
})
</script>

<style lang="less" scoped>
.config-page {
  :deep(.ant-card) {
    border-radius: 12px;
  }
}
</style>