import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截器（登录/注册不要带旧 Token，避免部分网关或后续 JWT 过滤器误判）
request.interceptors.request.use(
  config => {
    const url = config.url || ''
    const isLoginOrRegister = /\/user\/login\s*$/.test(url) || /\/user\/register\s*$/.test(url)
    if (isLoginOrRegister) {
      delete config.headers.Authorization
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    // 如果有 code 字段，检查 code 值
    if (res.code !== undefined) {
      if (res.code !== 200) {
        ElMessage.error(res.message || '请求失败')

        // 401 未授权，跳转到登录页
        if (res.code === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.push('/login')
        }

        return Promise.reject(new Error(res.message || '请求失败'))
      }
    }

    // 返回完整响应对象
    return res
  },
  error => {
    console.error('响应错误:', error)

    // 处理 HTTP 错误状态码
    if (error.response) {
      const status = error.response.status
      let message = '请求失败'

      switch (status) {
        case 400:
          message = error.response.data?.message || '请求参数错误'
          break
        case 401:
          message = '未授权，请先登录'
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.push('/login')
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = error.response.data?.message || '服务器内部错误'
          break
        case 502:
        case 503:
        case 504:
          message = '服务器暂时不可用'
          break
        default:
          message = error.response.data?.message || `请求失败 (${status})`
      }

      ElMessage.error(message)
      return Promise.reject(new Error(message))
    }

    // 网络错误
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else if (error.message === 'Network Error') {
      ElMessage.error('网络连接失败，请检查后端服务是否启动')
    } else {
      ElMessage.error(error.message || '网络错误')
    }

    return Promise.reject(error)
  }
)

export default request
