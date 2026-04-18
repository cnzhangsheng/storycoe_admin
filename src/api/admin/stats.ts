import { request } from '../request'

export interface StatsOverview {
  total_users: number
  total_books: number
  new_users_today: number
  new_books_today: number
  readings_today: number
}

export interface DailyStat {
  date: string
  count: number
}

export const adminStatsApi = {
  /**
   * 获取统计概览
   */
  getOverview(): Promise<StatsOverview> {
    return request.get('/stats/overview')
  },

  /**
   * 获取每日用户统计
   */
  getDailyUsers(days: number = 7): Promise<DailyStat[]> {
    return request.get('/stats/users/daily', { params: { days } })
  },

  /**
   * 获取每日绘本统计
   */
  getDailyBooks(days: number = 7): Promise<DailyStat[]> {
    return request.get('/stats/books/daily', { params: { days } })
  },
}