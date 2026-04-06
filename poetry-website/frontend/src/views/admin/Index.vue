<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="200px">
        <div class="admin-logo">管理后台</div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/admin/poetry">
            📚 诗词管理
          </el-menu-item>
          <el-menu-item index="/admin/post">
            💬 帖子管理
          </el-menu-item>
          <el-menu-item index="/admin/user">
            👤 用户管理
          </el-menu-item>
          <el-menu-item index="/admin/feedback">
            📝 反馈管理
          </el-menu-item>
          <el-menu-item index="/admin/statistics">
            📊 数据统计
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <div class="header-left">
            <span>欢迎回来，管理员</span>
          </div>
          <div class="header-right">
            <el-button @click="$router.push('/')">返回前台</el-button>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </div>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;

  .el-aside {
    background-color: #545c64;
    color: #fff;

    .admin-logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .el-header {
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .header-left {
      font-size: 16px;
      color: #333;
    }

    .header-right {
      display: flex;
      gap: 10px;
    }
  }

  .el-main {
    background: #f5f7fa;
    padding: 20px;
  }
}
</style>
