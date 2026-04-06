<template>
  <div class="poetry-detail" v-loading="loading">
    <div class="container" v-if="poetry">
      <el-card class="poetry-card">
        <!-- 诗词内容区 -->
        <div class="poetry-header">
          <h1 class="poetry-title">{{ poetry.title }}</h1>
          <div class="poetry-meta">
            <span class="author">{{ poetry.author }}</span>
            <el-tag type="warning" size="large">{{ poetry.dynasty }}</el-tag>
          </div>
        </div>

        <div class="poetry-content">
          <p v-for="(line, index) in poetry.lines" :key="index">{{ line }}</p>
        </div>

        <!-- 诗词信息 -->
        <div class="poetry-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="朝代">{{ poetry.dynasty }}</el-descriptions-item>
            <el-descriptions-item label="作者">{{ poetry.author }}</el-descriptions-item>
            <el-descriptions-item label="浏览次数">{{ poetry.viewCount || 0 }}</el-descriptions-item>
            <el-descriptions-item label="点赞次数">{{ poetry.likeCount || 0 }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="handleFavorite">
            <el-icon><Star /></el-icon>
            {{ isFavorited ? '已收藏' : '收藏' }}
          </el-button>
          <el-button :type="isLiked ? 'warning' : 'success'" @click="handleLike">
            <el-icon><Pointer /></el-icon>
            {{ isLiked ? '已点赞（点我取消）' : '点赞' }} {{ poetry.likeCount || 0 }}
          </el-button>
          <el-button @click="handleTTS">
            <el-icon><Microphone /></el-icon>
            朗读
          </el-button>
        </div>

        <!-- 译文 -->
        <div class="poetry-translation" v-if="poetry.translation">
          <h3>译文</h3>
          <p>{{ poetry.translation }}</p>
        </div>

        <!-- 赏析 -->
        <div class="poetry-analysis" v-if="poetry.analysis">
          <h3>赏析</h3>
          <p>{{ poetry.analysis }}</p>
        </div>

        <!-- AI 问答 -->
        <div class="ai-qa">
          <h3>AI 问答</h3>
          <div class="chat-box">
            <div class="chat-messages">
              <div
                v-for="(msg, index) in chatMessages"
                :key="index"
                :class="['message', msg.role]"
              >
                <div class="message-content">{{ msg.content }}</div>
              </div>
            </div>
            <div class="chat-input">
              <el-input
                v-model="chatQuestion"
                placeholder="请输入您的问题"
                @keyup.enter="sendChat"
              >
                <template #append>
                  <el-button :loading="chatLoading" @click="sendChat">发送</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 相关诗词 -->
      <div class="related-poetry" v-if="relatedPoetry.length > 0">
        <h2>相关诗词</h2>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="item in relatedPoetry" :key="item.id">
            <el-card class="related-card" @click="goToDetail(item.id)">
              <h3>{{ item.title }}</h3>
              <p>{{ item.author }} · {{ item.dynasty }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="empty-state" v-else>
      <el-empty description="诗词不存在或已删除" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { poetryApi, aiApi, favoriteApi, poetryLikeApi } from '@/api'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Star, Pointer, Microphone } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const poetry = ref(null)
const isFavorited = ref(false)
const isLiked = ref(false)
const chatLoading = ref(false)
const chatQuestion = ref('')
const chatMessages = ref([])
const relatedPoetry = ref([])

onMounted(async () => {
  await fetchPoetryDetail()
  await fetchRelatedPoetry()
})

// 获取诗词详情
const fetchPoetryDetail = async () => {
  loading.value = true
  try {
    const res = await poetryApi.getPoetryById(route.params.id)
    if (res.data) {
      poetry.value = {
        ...res.data,
        likeCount: res.data.likeCount || 0,
        lines: res.data.content ? res.data.content.split('\n') : []
      }

      // 检查是否收藏
      await checkFavorite()
      await checkLikeStatus()
      await loadLikeCount()
    }
  } catch (error) {
    console.error('获取诗词详情失败:', error)
    // 使用模拟数据
    poetry.value = {
      id: 1,
      title: '静夜思',
      author: '李白',
      dynasty: '唐代',
      content: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡',
      lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
      translation: '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
      analysis: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句写诗人在作客他乡的特定环境中一刹那间所产生的错觉；一个独处他乡的人，白天奔波忙碌，倒还能冲淡离愁，然而一到夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。',
      viewCount: 1234,
      likeCount: 567
    }
  } finally {
    loading.value = false
  }
}

// 获取相关诗词
const fetchRelatedPoetry = async () => {
  try {
    const res = await poetryApi.getPoetryList({ page: 1, size: 4 })
    if (res.data?.records) {
      relatedPoetry.value = res.data.records.filter(
        item => item.id !== poetry.value?.id
      )
    }
  } catch (error) {
    console.error('获取相关诗词失败:', error)
    relatedPoetry.value = [
      { id: 2, title: '望庐山瀑布', author: '李白', dynasty: '唐代' },
      { id: 3, title: '赠汪伦', author: '李白', dynasty: '唐代' },
      { id: 4, title: '早发白帝城', author: '李白', dynasty: '唐代' },
      { id: 5, title: '黄鹤楼送孟浩然之广陵', author: '李白', dynasty: '唐代' }
    ]
  }
}

// 检查是否收藏（登录态走 JWT 接口）
const checkFavorite = async () => {
  if (!poetry.value) return
  if (!userStore.isLogin) {
    isFavorited.value = false
    return
  }
  try {
    const res = await favoriteApi.isMyFavorited({ poetryId: poetry.value.id })
    isFavorited.value = res.data || false
  } catch {
    isFavorited.value = false
  }
}

// 收藏
const handleFavorite = async () => {
  if (!poetry.value) return
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (isFavorited.value) {
    try {
      await favoriteApi.removeMyFavorite({ poetryId: poetry.value.id })
      isFavorited.value = false
      ElMessage.success('已取消收藏')
    } catch {
      /* 拦截器已提示 */
    }
  } else {
    try {
      await favoriteApi.addMyFavorite({ poetryId: poetry.value.id })
      isFavorited.value = true
      ElMessage.success('收藏成功')
    } catch {
      /* 拦截器已提示 */
    }
  }
}

// 点赞
const handleLike = async () => {
  if (!poetry.value) return
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  try {
    if (isLiked.value) {
      await poetryLikeApi.removeMyLike({ poetryId: poetry.value.id })
      isLiked.value = false
      poetry.value.likeCount = Math.max((poetry.value.likeCount || 1) - 1, 0)
      ElMessage.success('已取消点赞')
    } else {
      await poetryLikeApi.addMyLike({ poetryId: poetry.value.id })
      isLiked.value = true
      poetry.value.likeCount = (poetry.value.likeCount || 0) + 1
      ElMessage.success('点赞成功')
    }
  } catch {
    /* 拦截器已提示 */
  }
}

// 检查是否点赞
const checkLikeStatus = async () => {
  if (!poetry.value || !userStore.isLogin) {
    isLiked.value = false
    return
  }
  try {
    const res = await poetryLikeApi.isMyLiked({ poetryId: poetry.value.id })
    isLiked.value = !!res.data
  } catch {
    isLiked.value = false
  }
}

// 获取点赞总数
const loadLikeCount = async () => {
  if (!poetry.value) return
  try {
    const res = await poetryLikeApi.getLikeCount({ poetryId: poetry.value.id })
    poetry.value.likeCount = Number(res.data || 0)
  } catch {
    poetry.value.likeCount = poetry.value.likeCount || 0
  }
}

// 朗读
const handleTTS = () => {
  if (!poetry.value) return
  const text = poetry.value.content
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  speechSynthesis.speak(utterance)
  ElMessage.success('正在朗读...')
}

// 发送 AI 问答
const sendChat = async () => {
  if (!chatQuestion.value.trim()) {
    ElMessage.warning('请输入问题')
    return
  }

  chatMessages.value.push({
    role: 'user',
    content: chatQuestion.value
  })

  chatLoading.value = true
  try {
    const res = await aiApi.chat(`${poetry.value.title} ${chatQuestion.value}`)
    if (res.data) {
      const content = typeof res.data === 'string' ? res.data : (res.data.answer || '暂未生成回答')
      chatMessages.value.push({
        role: 'assistant',
        content
      })
    }
  } catch (error) {
    console.error('AI 问答失败:', error)
    chatMessages.value.push({
      role: 'assistant',
      content: '抱歉，AI 服务暂时不可用。'
    })
  } finally {
    chatLoading.value = false
    chatQuestion.value = ''
  }
}

// 跳转到详情
const goToDetail = (id) => {
  router.push(`/poetry/${id}`)
  fetchPoetryDetail()
  fetchRelatedPoetry()
}
</script>

<style lang="scss" scoped>
.poetry-detail {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 40px 0;

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .poetry-card {
    border-radius: 12px;
    margin-bottom: 30px;
    overflow: hidden;

    .poetry-header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 30px;

      .poetry-title {
        font-size: 36px;
        color: #8B4513;
        margin-bottom: 15px;
        font-weight: bold;
      }

      .poetry-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;

        .author {
          font-size: 18px;
          color: #666;
        }
      }
    }

    .poetry-content {
      text-align: center;
      font-size: 24px;
      line-height: 2.5;
      color: #333;
      margin-bottom: 30px;
      padding: 20px 0;

      p {
        margin: 8px 0;
        font-family: 'KaiTi', '楷体', serif;
      }
    }

    .poetry-info {
      margin-bottom: 30px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;

      .el-button {
        min-width: 120px;
      }
    }

    .poetry-translation,
    .poetry-analysis {
      margin-bottom: 30px;
      padding: 25px;
      background: #fafafa;
      border-radius: 8px;
      border-left: 4px solid #8B4513;

      h3 {
        font-size: 20px;
        color: #8B4513;
        margin-bottom: 15px;
      }

      p {
        font-size: 16px;
        line-height: 1.8;
        color: #666;
        margin: 0;
      }
    }

    .ai-qa {
      padding: 25px;
      background: #f8f9fa;
      border-radius: 8px;

      h3 {
        font-size: 20px;
        color: #8B4513;
        margin-bottom: 20px;
      }

      .chat-box {
        max-height: 400px;
        display: flex;
        flex-direction: column;

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;

          .message {
            margin-bottom: 15px;

            &.user {
              text-align: right;

              .message-content {
                display: inline-block;
                background: #8B4513;
                color: #fff;
                padding: 10px 15px;
                border-radius: 12px;
                max-width: 80%;
              }
            }

            &.assistant {
              text-align: left;

              .message-content {
                display: inline-block;
                background: #fff;
                color: #333;
                padding: 10px 15px;
                border-radius: 12px;
                max-width: 80%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
            }
          }
        }
      }
    }
  }

  .related-poetry {
    h2 {
      font-size: 28px;
      color: #333;
      margin-bottom: 25px;
      text-align: center;
    }

    .related-card {
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 15px;
      text-align: center;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      }

      h3 {
        font-size: 18px;
        color: #8B4513;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }

  .empty-state {
    max-width: 600px;
    margin: 100px auto;
    padding: 60px 20px;
  }
}

@media (max-width: 768px) {
  .poetry-detail {
    padding: 20px 0;

    .poetry-card {
      .poetry-header {
        .poetry-title {
          font-size: 28px;
        }
      }

      .poetry-content {
        font-size: 18px;
      }

      .action-buttons {
        flex-wrap: wrap;
      }
    }
  }
}
</style>
