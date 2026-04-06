<template>
  <div class="admin-poetry">
    <div class="page-header">
      <h1>诗词管理</h1>
      <el-button type="primary" @click="showAddDialog">添加诗词</el-button>
    </div>

    <el-card>
      <el-table :data="poetryList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="dynasty" label="朝代" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="editPoetry(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deletePoetry(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const poetryList = ref([
  { id: 1, title: '静夜思', author: '李白', dynasty: '唐' },
  { id: 2, title: '春晓', author: '孟浩然', dynasty: '唐' }
])

onMounted(() => {
  fetchPoetryList()
})

const fetchPoetryList = () => {
  // TODO: 实现获取列表
}

const showAddDialog = () => {
  ElMessage.info('功能开发中...')
}

const editPoetry = (row) => {
  ElMessage.info('功能开发中...')
}

const deletePoetry = (id) => {
  ElMessage.info('功能开发中...')
}

const handlePageChange = () => {
  fetchPoetryList()
}
</script>

<style lang="scss" scoped>
.admin-poetry {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
      color: #333;
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
