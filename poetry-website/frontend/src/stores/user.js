import { defineStore } from 'pinia'
import { userApi } from '@/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  }),

  getters: {
    isLogin: (state) => !!state.token,
    isAdmin: (state) => state.userInfo?.role === 'ADMIN',
    userId: (state) => state.userInfo?.id,
    username: (state) => state.userInfo?.username,
    nickname: (state) => state.userInfo?.nickname
  },

  actions: {
    // 登录
    async login(username, password) {
      try {
        console.log('开始登录，用户名:', username)
        const res = await userApi.login({ username, password })
        console.log('登录响应完整数据:', res)
        console.log('登录响应 data:', res.data)

        // 检查返回数据结构
        if (res && res.data) {
          this.token = res.data.token || ''
          this.userInfo = res.data.user || null

          console.log('解析后的 token:', this.token)
          console.log('解析后的 userInfo:', this.userInfo)

          if (this.token) {
            localStorage.setItem('token', this.token)
          }

          if (this.userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          }

          if (this.token && this.userInfo) {
            ElMessage.success('登录成功')
            return true
          } else {
            ElMessage.error('登录失败，返回数据不完整')
            return false
          }
        } else {
          ElMessage.error('登录失败，服务器返回数据格式错误')
          return false
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请检查网络连接')
        return false
      }
    },

    // 注册
    async register(userData) {
      try {
        console.log('开始注册，用户名:', userData.username)
        const res = await userApi.register(userData)
        console.log('注册响应:', res)

        // 注册成功
        ElMessage.success(res.message || '注册成功')
        return true
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error(error.message || '注册失败，请稍后重试')
        return false
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await userApi.getUserInfo()
        if (res.data) {
          this.userInfo = res.data
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          return res.data
        }
        return null
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },

    // 登出
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('已退出登录')
    },

    // 更新用户信息
    updateUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },

    // 检查登录状态
    checkLoginStatus() {
      if (!this.token) {
        return false
      }

      // 如果有 token 但没有 userInfo，尝试获取用户信息
      if (!this.userInfo) {
        this.fetchUserInfo()
      }

      return true
    }
  }
})
