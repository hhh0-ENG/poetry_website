<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <span>📚</span>
          <span>古诗词文化网</span>
        </router-link>

        <nav class="nav">
          <router-link to="/">首页</router-link>
          <router-link to="/poetry">诗词库</router-link>
          <router-link to="/community">学习社区</router-link>
          <router-link to="/quiz">诗词自测</router-link>
          <router-link to="/ai">AI助手</router-link>
        </nav>

        <div class="user-actions">
          <template v-if="userStore.isLogin">
            <span class="user-avatar-wrap" @click="goProfile" title="个人中心">
              <el-avatar :size="36" :src="headerAvatarUrl">
                {{ (userStore.userInfo?.nickname || '用').charAt(0) }}
              </el-avatar>
            </span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="user-info">
                <span>{{ userStore.userInfo?.nickname || '用户' }}</span>
                <span class="caret">▾</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" v-if="userStore.userInfo">
                    🏠 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="favorite" v-if="userStore.userInfo">
                    ⭐ 我的收藏
                  </el-dropdown-item>
                  <el-dropdown-item command="admin" v-if="userStore.isAdmin">
                    ⚙️ 管理后台
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    🚪 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="$router.push('/login')">
              登录
            </el-button>
            <el-button size="small" @click="$router.push('/register')">
              注册
            </el-button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

function resolveMediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `/api${p}`
}

const headerAvatarUrl = computed(() => resolveMediaUrl(userStore.userInfo?.avatar))

const goProfile = () => {
  router.push('/profile')
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'favorite':
      router.push('/favorite')
      break
    case 'admin':
      router.push('/admin/poetry')
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('退出成功')
      router.push('/')
      break
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: linear-gradient(135deg, #8B4513 0%, #DAA520 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
    text-decoration: none;

    &:hover {
      opacity: 0.9;
    }
  }

  .nav {
    display: flex;
    gap: 25px;

    a {
      color: #fff;
      text-decoration: none;
      font-size: 15px;
      transition: opacity 0.3s;

      &:hover,
      &.router-link-active {
        opacity: 0.9;
        font-weight: bold;
      }
    }
  }

  .user-actions {
    display: flex;
    gap: 10px;
    align-items: center;

    .user-avatar-wrap {
      cursor: pointer;
      display: inline-flex;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.35);
      transition: transform 0.15s, box-shadow 0.15s;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      color: #fff;
      font-size: 15px;
      padding: 5px 12px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);

      .caret {
        font-size: 10px;
        opacity: 0.85;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    .header-content {
      height: auto;
      padding: 10px 0;
      flex-direction: column;
      gap: 10px;
    }

    .nav {
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
    }
  }
}
</style>
