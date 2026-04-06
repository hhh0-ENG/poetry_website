<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>我的收藏</h1>
        <p class="subtitle">收藏的诗词，随时品味</p>
        <el-button type="primary" link @click="$router.push('/profile')">前往个人中心管理资料</el-button>
      </div>

      <el-table v-loading="loading" :data="list" stripe empty-text="暂无收藏">
        <el-table-column prop="title" label="标题" min-width="160">
          <template #default="{ row }">
            <router-link :to="`/poetry/${row.id}`" class="poetry-link">{{ row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="dynasty" label="朝代" width="90" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link @click="removeOne(row)">取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          :page-size="size"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="loadList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { favoriteApi } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const list = ref([])
const page = ref(1)
const size = ref(10)
const total = ref(0)

async function loadList() {
  loading.value = true
  try {
    const res = await favoriteApi.getMyFavoriteList({ page: page.value, size: size.value })
    if (res.data) {
      list.value = res.data.records || []
      total.value = res.data.total ?? 0
    }
  } catch {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function removeOne(row) {
  try {
    await favoriteApi.removeMyFavorite({ poetryId: row.id })
    ElMessage.success('已取消收藏')
    await loadList()
  } catch {
    /* 拦截器已提示 */
  }
}

onMounted(() => {
  loadList()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 400px;
  padding-bottom: 40px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-header {
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
    color: #8b4513;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }
}

.poetry-link {
  color: #8b4513;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
}

.pager {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
