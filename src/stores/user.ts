import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminAuthApi } from '@/api/admin/auth'
import type { LoginParams } from '@/api/admin/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('admin_token') || '')
  const username = ref<string>('admin')

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)

  // 方法
  async function login(params: LoginParams) {
    try {
      const res = await adminAuthApi.login(params)
      token.value = res.access_token
      localStorage.setItem('admin_token', res.access_token)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message || '登录失败' }
    }
  }

  async function logout() {
    try {
      await adminAuthApi.logout()
    } catch (error) {
      // 忽略错误
    }
    token.value = ''
    localStorage.removeItem('admin_token')
  }

  function getToken() {
    return token.value
  }

  return {
    token,
    username,
    isAuthenticated,
    login,
    logout,
    getToken,
  }
})