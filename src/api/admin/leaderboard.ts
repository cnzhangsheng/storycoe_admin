import { request } from '../request'

export interface LeaderboardBook {
  id: string | number
  title: string
  cover_image?: string
  level: number
  read_count: number
  shelf_count: number
  score: number
  author_id: string | number
  author_name: string
  author_avatar?: string
  rank?: number
  created_at?: string
}

export interface LeaderboardAuthor {
  id: string | number
  name: string
  avatar?: string
  level: number
  books_created: number
  stars: number
  streak: number
  total_shelf_count: number
  score: number
  rank?: number
  created_at?: string
}

export interface LeaderboardBooksParams {
  page?: number
  page_size?: number
  search?: string
  sort_by?: 'score' | 'read_count' | 'shelf_count' | 'created_at'
}

export interface LeaderboardAuthorsParams {
  page?: number
  page_size?: number
  search?: string
  sort_by?: 'score' | 'books_created' | 'stars' | 'created_at'
}

export interface LeaderboardBooksResult {
  total: number
  page: number
  page_size: number
  books: LeaderboardBook[]
}

export interface LeaderboardAuthorsResult {
  total: number
  page: number
  page_size: number
  authors: LeaderboardAuthor[]
}

export const adminLeaderboardApi = {
  /**
   * 获取绘本排行榜
   */
  getBooks(params: LeaderboardBooksParams): Promise<LeaderboardBooksResult> {
    return request.get('/leaderboard/books', { params })
  },

  /**
   * 获取作者排行榜
   */
  getAuthors(params: LeaderboardAuthorsParams): Promise<LeaderboardAuthorsResult> {
    return request.get('/leaderboard/authors', { params })
  },

  /**
   * 更新绘本排行榜统计
   */
  updateBookStats(bookId: string | number, params: { read_count?: number; shelf_count?: number }): Promise<{ message: string }> {
    return request.put(`/leaderboard/books/${bookId}/stats`, null, { params })
  },

  /**
   * 更新作者排行榜统计
   */
  updateAuthorStats(userId: string | number, params: { books_created?: number; stars?: number }): Promise<{ message: string }> {
    return request.put(`/leaderboard/users/${userId}/stats`, null, { params })
  },
}