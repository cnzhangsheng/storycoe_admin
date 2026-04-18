import { request } from '../request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  access_token: string
  token_type: string
  expires_in: number
}

export interface MessageResult {
  message: string
  success?: boolean
}

export const adminAuthApi = {
  /**
   * 管理员登录
   */
  login(params: LoginParams): Promise<LoginResult> {
    return request.post('/auth/login', params)
  },

  /**
   * 管理员登出
   */
  logout(): Promise<MessageResult> {
    return request.post('/auth/logout')
  },
}