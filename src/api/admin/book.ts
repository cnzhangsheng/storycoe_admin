import { request } from '../request'

export interface BookItem {
  id: string | number
  title: string
  user_id: string | number
  user_name?: string
  status: string // draft | generating | completed | error
  share_type: string // public | private
  progress: number
  level: number
  cover_image?: string
  read_count?: number
  shelf_count?: number
  created_at: string
}

export interface BookListParams {
  page?: number
  page_size?: number
  search?: string
  status?: string
  share_type?: string // public | private
}

export interface BookListResult {
  total: number
  page: number
  page_size: number
  books: BookItem[]
}

export interface BookPage {
  id: string | number
  page_number: number
  image_url?: string
  sentences: BookSentence[]
}

export interface BookSentence {
  id: string | number
  sentence_order: number
  en: string
  zh: string
  audio_url?: string
}

export interface BookDetail {
  id: string | number
  title: string
  user_id: string | number
  user_name?: string
  status: string
  progress: number
  level: number
  has_audio: boolean
  cover_image?: string
  created_at: string
  pages: BookPage[]
}

export const adminBookApi = {
  /**
   * 获取绘本列表
   */
  getList(params: BookListParams): Promise<BookListResult> {
    return request.get('/books', { params })
  },

  /**
   * 获取绘本详情
   */
  getDetail(bookId: string | number): Promise<BookDetail> {
    return request.get(`/books/${bookId}`)
  },

  /**
   * 更新绘本状态
   */
  updateStatus(bookId: string | number, status: string): Promise<{ message: string }> {
    return request.put(`/books/${bookId}/status`, null, { params: { status } })
  },

  /**
   * 更新绘本分享类型（公开/私有）
   */
  updateShareType(bookId: string | number, shareType: string): Promise<{ message: string }> {
    return request.put(`/books/${bookId}/share-type`, null, { params: { share_type: shareType } })
  },

  /**
   * 删除绘本
   */
  delete(bookId: string | number): Promise<{ message: string }> {
    return request.delete(`/books/${bookId}`)
  },
}