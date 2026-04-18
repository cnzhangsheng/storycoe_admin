import { request } from '../request'

export interface ConfigItem {
  key: string
  value: string
  description?: string
  updated_at?: string
}

export interface ConfigUpdateParams {
  value: string
  description?: string
}

export const adminConfigApi = {
  /**
   * 获取所有配置
   */
  getList(): Promise<ConfigItem[]> {
    return request.get('/configs')
  },

  /**
   * 更新配置
   */
  update(key: string, params: ConfigUpdateParams): Promise<{ message: string }> {
    return request.put(`/configs/${key}`, params)
  },
}