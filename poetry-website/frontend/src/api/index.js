import request from '@/utils/request'

// 用户相关API
export const userApi = {
  // 登录
  login(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data
    })
  },
  // 注册
  register(data) {
    return request({
      url: '/user/register',
      method: 'post',
      data
    })
  },
  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/user/info',
      method: 'get'
    })
  },
  // 获取用户列表
  getUserList(params) {
    return request({
      url: '/user/list',
      method: 'get',
      params
    })
  },
  // 更新用户状态
  updateUserStatus(data) {
    return request({
      url: '/user/status',
      method: 'put',
      data
    })
  },
  // 删除用户
  deleteUser(id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  },
  updateProfile(data) {
    return request({
      url: '/user/profile',
      method: 'put',
      data
    })
  },
  changePassword(data) {
    return request({
      url: '/user/password',
      method: 'put',
      data
    })
  },
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/user/avatar',
      method: 'post',
      data: formData
    })
  }
}

// 诗词相关API
export const poetryApi = {
  // 获取诗词列表
  getPoetryList(params) {
    return request({
      url: '/poetry/list',
      method: 'get',
      params
    })
  },
  // 获取诗词详情
  getPoetryById(id) {
    return request({
      url: `/poetry/${id}`,
      method: 'get'
    })
  },
  // 添加诗词
  addPoetry(data) {
    return request({
      url: '/poetry/add',
      method: 'post',
      data
    })
  },
  // 更新诗词
  updatePoetry(data) {
    return request({
      url: '/poetry/update',
      method: 'put',
      data
    })
  },
  // 删除诗词
  deletePoetry(id) {
    return request({
      url: `/poetry/${id}`,
      method: 'delete'
    })
  },
  // 导入诗词
  importPoetry(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/poetry/import',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 获取诗词统计
  getPoetryStatistics() {
    return request({
      url: '/poetry/statistics',
      method: 'get'
    })
  }
}

// 分类相关API
export const categoryApi = {
  // 获取分类列表
  getCategoryList() {
    return request({
      url: '/category/list',
      method: 'get'
    })
  }
}

// 帖子相关API
export const postApi = {
  // 获取帖子列表
  getPostList(params) {
    return request({
      url: '/post/list',
      method: 'get',
      params
    })
  },
  // 获取帖子详情
  getPostById(id) {
    return request({
      url: `/post/${id}`,
      method: 'get'
    })
  },
  // 添加帖子
  addPost(data) {
    return request({
      url: '/post/add',
      method: 'post',
      data
    })
  },
  // 更新帖子
  updatePost(data) {
    return request({
      url: '/post/update',
      method: 'put',
      data
    })
  },
  // 删除帖子
  deletePost(id) {
    return request({
      url: `/post/${id}`,
      method: 'delete'
    })
  },
  // 审核通过
  approvePost(id) {
    return request({
      url: `/post/approve/${id}`,
      method: 'put'
    })
  },
  // 审核拒绝
  rejectPost(id, reason) {
    return request({
      url: `/post/reject/${id}`,
      method: 'put',
      data: { reason }
    })
  },
  // 增加浏览量
  incrementViewCount(id) {
    return request({
      url: `/post/view/${id}`,
      method: 'put'
    })
  },
  // 增加点赞数
  incrementLikeCount(id) {
    return request({
      url: `/post/like/${id}`,
      method: 'put'
    })
  }
}

// 收藏相关API
export const favoriteApi = {
  // 获取收藏列表
  getFavoriteList(params) {
    return request({
      url: '/favorite/list',
      method: 'get',
      params
    })
  },
  // 添加收藏
  addFavorite(data) {
    return request({
      url: '/favorite/add',
      method: 'post',
      data
    })
  },
  // 取消收藏
  removeFavorite(data) {
    return request({
      url: '/favorite/remove',
      method: 'delete',
      data
    })
  },
  // 检查是否收藏
  isFavorited(params) {
    return request({
      url: '/favorite/check',
      method: 'get',
      params
    })
  },
  getMyFavoriteList(params) {
    return request({
      url: '/favorite/my/list',
      method: 'get',
      params
    })
  },
  addMyFavorite(data) {
    return request({
      url: '/favorite/my/add',
      method: 'post',
      data
    })
  },
  removeMyFavorite(data) {
    return request({
      url: '/favorite/my/remove',
      method: 'delete',
      data
    })
  },
  isMyFavorited(params) {
    return request({
      url: '/favorite/my/check',
      method: 'get',
      params
    })
  }
}

// 诗词点赞相关API
export const poetryLikeApi = {
  addMyLike(data) {
    return request({
      url: '/poetry-like/my/add',
      method: 'post',
      data
    })
  },
  removeMyLike(data) {
    return request({
      url: '/poetry-like/my/remove',
      method: 'delete',
      data
    })
  },
  isMyLiked(params) {
    return request({
      url: '/poetry-like/my/check',
      method: 'get',
      params
    })
  },
  getLikeCount(params) {
    return request({
      url: '/poetry-like/count',
      method: 'get',
      params
    })
  }
}

// 每日一诗相关API
export const dailyPoetryApi = {
  // 获取今日诗词（与后端 DailyPoetryController /daily/today 一致）
  getTodayPoetry() {
    return request({
      url: '/daily/today',
      method: 'get'
    })
  }
}

// AI助手相关API
export const aiApi = {
  // AI对话
  chat(payload) {
    const data = typeof payload === 'string' ? { question: payload } : payload
    return request({
      url: '/ai/chat',
      method: 'post',
      data
    })
  },
  searchPoetry(payload) {
    return request({
      url: '/ai/search',
      method: 'post',
      data: payload
    })
  }
}

// 反馈相关API
export const feedbackApi = {
  // 提交反馈
  submitFeedback(data) {
    return request({
      url: '/feedback/add',
      method: 'post',
      data
    })
  },
  // 获取反馈列表
  getFeedbackList(params) {
    return request({
      url: '/feedback/list',
      method: 'get',
      params
    })
  }
}

// 填空题相关API
export const quizApi = {
  // 获取题目列表
  getQuizList(params) {
    return request({
      url: '/quiz/list',
      method: 'get',
      params
    })
  },
  // 提交答案
  submitAnswer(data) {
    return request({
      url: '/quiz/answer',
      method: 'post',
      data
    })
  }
}

// 统计相关API
export const statisticsApi = {
  // 获取统计数据
  getStatistics() {
    return request({
      url: '/statistics/overview',
      method: 'get'
    })
  }
}
