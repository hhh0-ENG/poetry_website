<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1>用户登录</h1>
          <p>古诗词文化网</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          @submit.prevent="handleLogin"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              style="width: 100%"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>

        <!-- 测试账号提示 -->
        <div class="test-account">
          <el-alert
            title="测试账号"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>管理员：admin / admin123</p>
              <p>普通用户：user / 123456</p>
            </template>
          </el-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: 'admin123'
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) {
    console.error('登录表单引用不存在')
    return
  }

  try {
    // 表单验证
    await loginFormRef.value.validate()
    console.log('表单验证通过')
  } catch (error) {
    console.log('表单验证失败:', error)
    return
  }

  loading.value = true
  try {
    console.log('准备登录，用户名:', loginForm.username)
    const success = await userStore.login(loginForm.username, loginForm.password)

    if (success) {
      console.log('登录成功，准备跳转')
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      console.log('登录失败')
    }
  } catch (error) {
    console.error('登录异常:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B4513 0%, #DAA520 100%);
  padding: 20px;

  .login-container {
    width: 100%;
    max-width: 420px;
  }

  .login-box {
    background: #fff;
    border-radius: 16px;
    padding: 40px 35px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

    .login-header {
      text-align: center;
      margin-bottom: 35px;

      h1 {
        font-size: 32px;
        color: #8B4513;
        margin-bottom: 8px;
        font-weight: bold;
      }

      p {
        font-size: 16px;
        color: #999;
        margin: 0;
      }
    }

    .login-form {
      margin-bottom: 20px;

      .el-form-item {
        margin-bottom: 20px;
      }
    }

    .login-footer {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;

      a {
        color: #8B4513;
        text-decoration: none;
        margin-left: 5px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .test-account {
      p {
        margin: 5px 0;
        font-size: 13px;
        color: #666;
      }
    }
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 15px;

    .login-box {
      padding: 30px 25px;
    }
  }
}
</style>
