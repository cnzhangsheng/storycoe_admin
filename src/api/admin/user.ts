import { request } from '../request'

export interface UserItem {
  id: string | number
  name: string
  phone?: string
  avatar?: string
  role: number
  role_name: string
  level: number
  books_read: number
  stars: number
  streak: number
  is_active: boolean
  is_banned: boolean
  banned_reason?: string
  created_at: string
  updated_at: string
}

export interface UserListParams {
  page?: number
  page_size?: number
  search?: string
  is_banned?: boolean
}

export interface UserListResult {
  total: number
  page: number
  page_size: number
  users: UserItem[]
}

export interface BanParams {
  reason: string
}

export interface RoleParams {
  role: number // 0=普通用户, 1=高级用户, 10=管理员
}

export const adminUserApi = {
  /**
   * 获取用户列表
   */
  getList(params: UserListParams): Promise<UserListResult> {
    return request.get('/users', { params })
  },

  /**
   * 获取用户详情
   */
  getDetail(userId: string | number): Promise<UserItem> {
    return request.get(`/users/${userId}`)
  },

  /**
   * 封禁用户
   */
  ban(userId: string | number, params: BanParams): Promise<{ message: string }> {
    return request.put(`/users/${userId}/ban`, params)
  },

  /**
   * 解封用户
   */
  unban(userId: string | number): Promise<{ message: string }> {
    return request.put(`/users/${userId}/unban`)
  },

  /**
   * 删除用户
   */
  delete(userId: string | number): Promise<{ message: string }> {
    return request.delete(`/users/${userId}`)
  },

  /**
   * 更新用户角色
   */
  updateRole(userId: string | number, params: RoleParams): Promise<{ message: string }> {
    return request.put(`/users/${userId}/role`, params)
  },
}