<template>
  <div class="home">
    <!-- 每日一诗：有数据或加载中才展示，避免无数据时出现“没有诗词”等提示 -->
    <div class="daily-poetry-section" v-if="showDailySection">
      <div class="container">
        <el-card class="daily-card" v-loading="loading">
          <div v-if="dailyPoetry" class="daily-content">
            <div class="daily-header">
              <div class="date-badge">
                <div class="day">{{ currentDate.day }}</div>
                <div class="month-year">{{ currentDate.month }}月</div>
              </div>
              <div class="title-section">
                <h2 class="poetry-title">{{ dailyPoetry.title }}</h2>
                <p class="poetry-meta">
                  <span class="author">{{ dailyPoetry.author }}</span>
                  <el-tag size="small" type="warning">{{ dailyPoetry.dynasty }}</el-tag>
                </p>
              </div>
            </div>
            <div class="daily-body">
              <p v-for="(line, index) in dailyPoetry.lines" :key="index">{{ line }}</p>
            </div>
            <div class="daily-footer">
              <el-button type="primary" text @click="viewDetail(dailyPoetry.id)">
                查看详情与赏析 <el-icon><ArrowRight /></el-icon>
              </el-button>
              <el-button type="primary" text @click="refreshDaily">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
          <div v-else class="empty-state">
            <el-icon><Loading /></el-icon>
            <p>加载中...</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 功能导航区 -->
    <div class="features-section">
      <div class="container">
        <div class="section-title">
          <h2>功能导航</h2>
          <p>探索更多精彩功能</p>
        </div>
        <el-row :gutter="24">
          <el-col :xs="12" :sm="12" :md="6">
            <div class="feature-card" @click="goToDaily">
              <div class="feature-icon-wrapper">
                <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <el-icon><Calendar /></el-icon>
                </div>
              </div>
              <h3>每日一诗</h3>
              <p>每日精选，品味经典</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6">
            <div class="feature-card" @click="goToQuiz">
              <div class="feature-icon-wrapper">
                <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                  <el-icon><EditPen /></el-icon>
                </div>
              </div>
              <h3>诗词自测</h3>
              <p>趣味填空，检验学习</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6">
            <div class="feature-card" @click="goToAI">
              <div class="feature-icon-wrapper">
                <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
              </div>
              <h3>AI助手</h3>
              <p>智能问答，解析诗意</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6">
            <div class="feature-card" @click="goToCommunity">
              <div class="feature-icon-wrapper">
                <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                  <el-icon><ChatLineSquare /></el-icon>
                </div>
              </div>
              <h3>学习社区</h3>
              <p>诗友交流，分享心得</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 热门诗词推荐区 -->
    <div class="popular-section">
      <div class="container">
        <div class="section-title">
          <h2>热门诗词推荐</h2>
          <p>最受喜爱的经典作品</p>
        </div>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="poetry in popularPoetryList" :key="poetry.id">
            <el-card class="poetry-card" shadow="hover" @click="viewDetail(poetry.id)">
              <div class="poetry-content">
                <h3 class="poetry-title">{{ poetry.title }}</h3>
                <div class="poetry-meta">
                  <span class="author">{{ poetry.author }}</span>
                  <el-tag size="small" type="warning">{{ poetry.dynasty }}</el-tag>
                </div>
                <p class="poetry-excerpt">{{ poetry.excerpt }}</p>
                <div class="poetry-stats">
                  <span><el-icon><View /></el-icon> {{ poetry.viewCount || 0 }}</span>
                  <span><el-icon><Star /></el-icon> {{ poetry.likeCount || 0 }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="load-more" v-if="hasMore">
          <el-button type="primary" plain @click="loadMore" :loading="loadingMore">
            加载更多
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dailyPoetryApi, poetryApi } from '@/api'
import { ElMessage } from 'element-plus'
import {
  ArrowRight,
  Refresh,
  Loading,
  Calendar,
  EditPen,
  ChatDotRound,
  ChatLineSquare,
  View,
  Star
} from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const loadingMore = ref(false)
const dailyPoetry = ref(null)

const showDailySection = computed(() => loading.value || !!dailyPoetry.value)
const popularPoetryList = ref([])
const currentPage = ref(1)
const hasMore = ref(true)

const currentDate = computed(() => {
  const now = new Date()
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear()
  }
})

// 获取每日一诗（后端返回 { poetry, audioUrl }）
const fetchDailyPoetry = async () => {
  loading.value = true
  dailyPoetry.value = null
  try {
    const res = await dailyPoetryApi.getTodayPoetry()
    const p = res.data?.poetry
    if (p && p.id) {
      const content = p.content || ''
      dailyPoetry.value = {
        id: p.id,
        title: p.title,
        author: p.author,
        dynasty: p.dynasty,
        content,
        lines: content ? content.split(/\n/).filter(Boolean) : [],
        audioUrl: res.data.audioUrl
      }
    }
  } catch (error) {
    console.error('获取每日一诗失败:', error)
    dailyPoetry.value = null
  } finally {
    loading.value = false
  }
}

// 获取热门诗词
const fetchPopularPoetry = async () => {
  try {
    const res = await poetryApi.getPoetryList({
      page: currentPage.value,
      size: 8,
      keyword: ''
    })
    if (res.data?.records) {
      const newList = res.data.records.map(item => ({
        ...item,
        excerpt: item.content ? item.content.substring(0, 40) + '...' : ''
      }))

      if (currentPage.value === 1) {
        popularPoetryList.value = newList
      } else {
        popularPoetryList.value.push(...newList)
      }

      hasMore.value = res.data.records.length === 8
    }
  } catch (error) {
    console.error('获取热门诗词失败:', error)
    // 使用模拟数据
    if (currentPage.value === 1) {
      popularPoetryList.value = [
        {
          id: 1,
          title: '静夜思',
          author: '李白',
          dynasty: '唐代',
          excerpt: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
          viewCount: 1234,
          likeCount: 567
        },
        {
          id: 2,
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐代',
          excerpt: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
          viewCount: 987,
          likeCount: 432
        },
        {
          id: 3,
          title: '登鹳雀楼',
          author: '王之涣',
          dynasty: '唐代',
          excerpt: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
          viewCount: 876,
          likeCount: 389
        },
        {
          id: 4,
          title: '江雪',
          author: '柳宗元',
          dynasty: '唐代',
          excerpt: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
          viewCount: 765,
          likeCount: 321
        },
        {
          id: 5,
          title: '咏鹅',
          author: '骆宾王',
          dynasty: '唐代',
          excerpt: '鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。',
          viewCount: 654,
          likeCount: 298
        },
        {
          id: 6,
          title: '悯农',
          author: '李绅',
          dynasty: '唐代',
          excerpt: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
          viewCount: 543,
          likeCount: 267
        },
        {
          id: 7,
          title: '望庐山瀑布',
          author: '李白',
          dynasty: '唐代',
          excerpt: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
          viewCount: 432,
          likeCount: 234
        },
        {
          id: 8,
          title: '赋得古原草送别',
          author: '白居易',
          dynasty: '唐代',
          excerpt: '离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。',
          viewCount: 321,
          likeCount: 198
        }
      ]
      hasMore.value = false
    }
  }
}

// 刷新每日一诗
const refreshDaily = () => {
  fetchDailyPoetry()
  ElMessage.success('已刷新')
}

// 加载更多
const loadMore = () => {
  loadingMore.value = true
  currentPage.value++
  fetchPopularPoetry().finally(() => {
    loadingMore.value = false
  })
}

// 查看详情
const viewDetail = (id) => {
  router.push(`/poetry/${id}`)
}

// 导航跳转
const goToDaily = () => router.push('/daily')
const goToQuiz = () => router.push('/quiz')
const goToAI = () => router.push('/ai')
const goToCommunity = () => router.push('/community')

onMounted(() => {
  fetchDailyPoetry()
  fetchPopularPoetry()
})
</script>

<style lang="scss" scoped>
.home {
  background: #f5f7fa;
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

// 每日一诗区
.daily-poetry-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;

  .daily-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

    .daily-content {
      .daily-header {
        display: flex;
        align-items: center;
        gap: 30px;
        padding-bottom: 30px;
        border-bottom: 2px solid #f0f0f0;
        margin-bottom: 30px;

        .date-badge {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;

          .day {
            font-size: 36px;
            font-weight: bold;
            line-height: 1;
          }

          .month-year {
            font-size: 14px;
            margin-top: 4px;
            opacity: 0.9;
          }
        }

        .title-section {
          flex: 1;

          .poetry-title {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
          }

          .poetry-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 0;

            .author {
              font-size: 16px;
              color: #666;
            }
          }
        }
      }

      .daily-body {
        text-align: center;
        font-size: 22px;
        line-height: 2.5;
        color: #333;
        margin-bottom: 30px;
        padding: 20px 0;

        p {
          margin: 8px 0;
          font-family: 'KaiTi', '楷体', serif;
        }
      }

      .daily-footer {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding-top: 20px;
        border-top: 2px solid #f0f0f0;
      }
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #999;

      .el-icon {
        font-size: 48px;
        margin-bottom: 20px;
      }
    }
  }
}

// 功能导航区
.features-section {
  padding: 80px 0;
  background: #fff;

  .section-title {
    text-align: center;
    margin-bottom: 50px;

    h2 {
      font-size: 36px;
      color: #333;
      margin-bottom: 10px;
      font-weight: bold;
    }

    p {
      font-size: 16px;
      color: #999;
    }
  }

  .feature-card {
    text-align: center;
    padding: 40px 30px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 12px;
    background: #f9f9f9;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      background: #fff;
    }

    .feature-icon-wrapper {
      margin-bottom: 20px;

      .feature-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

        .el-icon {
          font-size: 40px;
          color: #fff;
        }
      }
    }

    h3 {
      font-size: 20px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      font-size: 14px;
      color: #999;
      line-height: 1.6;
    }
  }
}

// 热门诗词区
.popular-section {
  padding: 80px 0;
  background: #f5f7fa;

  .section-title {
    text-align: center;
    margin-bottom: 50px;

    h2 {
      font-size: 36px;
      color: #333;
      margin-bottom: 10px;
      font-weight: bold;
    }

    p {
      font-size: 16px;
      color: #999;
    }
  }

  .poetry-card {
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .poetry-content {
      padding: 10px;

      .poetry-title {
        font-size: 18px;
        color: #333;
        margin-bottom: 12px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .poetry-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        .author {
          font-size: 14px;
          color: #666;
        }
      }

      .poetry-excerpt {
        font-size: 14px;
        color: #999;
        line-height: 1.8;
        margin-bottom: 15px;
        min-height: 50px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-family: 'KaiTi', '楷体', serif;
      }

      .poetry-stats {
        display: flex;
        gap: 20px;
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;
        font-size: 13px;
        color: #999;

        span {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
    }
  }

  .load-more {
    text-align: center;
    margin-top: 40px;

    .el-button {
      padding: 12px 50px;
      font-size: 16px;
      border-radius: 25px;
    }
  }
}

@media (max-width: 768px) {
  .home {
    .daily-poetry-section {
      padding: 30px 15px;

      .daily-card {
        .daily-content {
          .daily-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;

            .date-badge {
              margin: 0 auto;
            }

            .title-section {
              .poetry-title {
                font-size: 24px;
              }
            }
          }

          .daily-body {
            font-size: 18px;
          }

          .daily-footer {
            flex-direction: column;
            gap: 10px;
          }
        }
      }
    }

    .features-section,
    .popular-section {
      padding: 40px 0;

      .section-title {
        h2 {
          font-size: 28px;
        }
      }

      .feature-card {
        padding: 30px 20px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
