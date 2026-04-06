<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>AI助手</h1>
        <p class="subtitle">诗词问答，一站式辅助学习</p>
      </div>

      <el-card class="chat-card" shadow="never">
        <template #header>
          <div class="card-title">诗词对话</div>
        </template>

        <div class="quick-area">
          <div class="label">试试看：</div>
          <div class="chips">
            <el-tag
              v-for="item in quickQuestions"
              :key="item"
              class="chip"
              effect="plain"
              @click="useQuestion(item)"
            >
              {{ item }}
            </el-tag>
          </div>
        </div>

        <div class="chat-window" ref="chatWindowRef">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['msg', msg.role]">
            <div class="bubble">
              <div class="content">{{ msg.content }}</div>
              <div v-if="msg.followUps?.length" class="followups">
                <el-tag
                  v-for="f in msg.followUps"
                  :key="f"
                  size="small"
                  class="follow-tag"
                  @click="useQuestion(f)"
                >
                  {{ f }}
                </el-tag>
              </div>
              <div v-if="msg.relatedPoetry?.length" class="related">
                <div class="related-title">关联诗词：</div>
                <el-link
                  v-for="poem in msg.relatedPoetry"
                  :key="poem.id"
                  type="primary"
                  :underline="false"
                  @click="$router.push(`/poetry/${poem.id}`)"
                >
                  《{{ poem.title }}》{{ poem.dynasty }}·{{ poem.author }}
                </el-link>
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <el-input
            v-model="question"
            type="textarea"
            :rows="3"
            maxlength="300"
            show-word-limit
            resize="none"
            placeholder="输入你的诗词问题，例如：静夜思的情感主旨是什么？"
            @keydown.ctrl.enter.prevent="sendQuestion"
          />
          <div class="actions">
            <el-button @click="clearConversation">清空对话</el-button>
            <el-button type="primary" :loading="sending" @click="sendQuestion">发送（Ctrl+Enter）</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { aiApi } from '@/api'

const question = ref('')
const sending = ref(false)
const chatWindowRef = ref(null)

const quickQuestions = [
  '静夜思的作者是谁？',
  '请赏析《登鹳雀楼》的艺术手法。',
  '苏轼的代表作有哪些？',
  '“海内存知己，天涯若比邻”怎么理解？'
]

const messages = ref([
  {
    role: 'assistant',
    content: '你好，我是古诗词 AI 助手。你可以问我：诗词赏析、作者介绍、名句解读、主题推荐、诗词检索与学习技巧。'
  }
])

function buildHistory() {
  return messages.value
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content }))
}

function useQuestion(text) {
  question.value = text
  sendQuestion()
}

async function sendQuestion() {
  const q = question.value.trim()
  if (!q) {
    ElMessage.warning('请输入问题')
    return
  }
  const payload = {
    question: q,
    history: buildHistory()
  }

  messages.value.push({ role: 'user', content: q })
  question.value = ''
  sending.value = true

  try {
    const res = await aiApi.chat(payload)
    messages.value.push({
      role: 'assistant',
      content: res.data?.answer || '暂时没有生成回答，请稍后重试。',
      followUps: res.data?.followUpSuggestions || [],
      relatedPoetry: res.data?.relatedPoetry || []
    })
    scrollToBottom()
  } catch {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，当前服务繁忙，请稍后再试。'
    })
  } finally {
    sending.value = false
  }
}

function clearConversation() {
  messages.value = [
    {
      role: 'assistant',
      content: '对话已清空。你可以继续提问，我会结合上下文和诗词库为你解答。'
    }
  ]
}

async function scrollToBottom() {
  await nextTick()
  const dom = chatWindowRef.value
  if (dom) {
    dom.scrollTop = dom.scrollHeight
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 640px;
  padding-bottom: 28px;

  .page-header {
    margin-bottom: 20px;

    h1 {
      font-size: 28px;
      color: #8B4513;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
    }
  }
}

.card-title {
  font-weight: 700;
  color: #8b4513;
}

.chat-card,
.panel-card {
  border-radius: 12px;
  margin-bottom: 18px;
}

.chat-card {
  max-width: 900px;
  margin: 0 auto;
}

.quick-area {
  margin-bottom: 10px;

  .label {
    color: #666;
    margin-bottom: 8px;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  cursor: pointer;
}

.chat-window {
  height: 460px;
  overflow-y: auto;
  border: 1px solid #f0e3d5;
  border-radius: 10px;
  background: #fffdfa;
  padding: 14px;
  margin-bottom: 12px;
}

.msg {
  display: flex;
  margin-bottom: 12px;

  .bubble {
    max-width: 88%;
    padding: 10px 12px;
    border-radius: 10px;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  &.assistant .bubble {
    background: #f6f8ff;
    border: 1px solid #e8ecff;
  }

  &.user {
    justify-content: flex-end;
  }

  &.user .bubble {
    background: #8b4513;
    color: #fff;
  }
}

.followups,
.related {
  margin-top: 10px;
}

.follow-tag {
  margin-right: 6px;
  margin-bottom: 6px;
  cursor: pointer;
}

.related-title {
  margin-bottom: 4px;
  color: #666;
  font-size: 13px;
}

.input-area {
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }
}

</style>
