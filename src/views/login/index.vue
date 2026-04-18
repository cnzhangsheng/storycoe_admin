<template>
  <div class="login-page">
    <a-card class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <BookOutlined />
      </div>
      <h1 class="login-title">StoryCoe Admin</h1>
      <p class="login-subtitle">后台管理控制台</p>

      <!-- 登录表单 -->
      <a-form
        :model="formState"
        @finish="handleLogin"
        layout="vertical"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
          >
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
          >
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>

        <!-- 错误提示 -->
        <a-alert
          v-if="errorMessage"
          type="error"
          :message="errorMessage"
          show-icon
          style="margin-bottom: 16px"
        />

        <!-- 登录按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            size="large"
            html-type="submit"
            block
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { BookOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const userStore = useUserStore()

const formState = ref({
  username: 'admin',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  const result = await userStore.login({
    username: formState.value.username,
    password: formState.value.password,
  })

  loading.value = false

  if (result.success) {
    message.success('登录成功')
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message || '登录失败'
  }
}
</script>

<style lang="less" scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-card {
    width: 400px;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

    .login-logo {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(37, 99, 235, 0.1);
      border-radius: 16px;
      font-size: 32px;
      color: #2563eb;
    }

    .login-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .login-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 32px;
    }
  }
}
</style>