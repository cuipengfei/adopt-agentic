<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'

type MsgRole = 'system' | 'user' | 'assistant' | 'tool'

interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

interface MessageItem {
  role: MsgRole
  content: string
  tool_calls?: ToolCall[]
  tool_call_id?: string
  name?: string
}

const route = useRoute()
const currentStep = ref(1)

const isEn = computed(() => route.path.startsWith('/en/'))

const steps = computed(() => {
  if (isEn.value) {
    return [
      'Step 1 · Empty request',
      'Step 2 · Add system prompt',
      'Step 3 · Add user message',
      'Step 4 · Simulate assistant + tool_call',
      'Step 5 · Add tool result + round two',
    ]
  }

  return [
    '步骤 1 · 空请求',
    '步骤 2 · 添加 System Prompt',
    '步骤 3 · 添加用户消息',
    '步骤 4 · 模拟 assistant + tool_call',
    '步骤 5 · 追加 tool 结果 + 第 2 轮',
  ]
})

const tokenByStep = [0, 120, 180, 450, 920]

const currentToken = computed(() => tokenByStep[currentStep.value - 1] ?? 0)

const tokenClass = computed(() => {
  if (currentToken.value >= 800) return 'aa-context-builder__token--red'
  if (currentToken.value >= 300) return 'aa-context-builder__token--yellow'
  return 'aa-context-builder__token--green'
})

const allMessages = computed<MessageItem[]>(() => {
  const systemPrompt = isEn.value
    ? 'You are a strict coding assistant. Follow project conventions and verify before editing.'
    : '你是严格的代码助手。修改前先验证，遵循项目规范。'

  const userMsg1 = isEn.value
    ? 'Please inspect docs/guide/context.md and propose a safe update plan.'
    : '请检查 docs/guide/context.md，并给出一个安全的修改计划。'

  const assistantMsg = isEn.value
    ? 'I will first read the file and gather relevant context.'
    : '我会先读取文件，再收集相关上下文。'

  const toolResult = isEn.value
    ? 'Read result: file has 329 lines, section "Context Pollution" starts at line 178.'
    : '读取结果：文件共 329 行，"上下文污染" 小节从第 178 行开始。'

  const userMsg2 = isEn.value
    ? 'Great. Apply the update and keep terminology consistent in Chinese and English.'
    : '很好。请执行修改，并保持中英文术语一致。'

  const result: MessageItem[] = []

  if (currentStep.value >= 2) {
    result.push({
      role: 'system',
      content: systemPrompt,
    })
  }

  if (currentStep.value >= 3) {
    result.push({
      role: 'user',
      content: userMsg1,
    })
  }

  if (currentStep.value >= 4) {
    result.push({
      role: 'assistant',
      content: assistantMsg,
      tool_calls: [
        {
          id: 'call_read_context_md',
          type: 'function',
          function: {
            name: 'read_file',
            arguments: JSON.stringify({
              filePath: '/home/cpf/code-inside/adopt-agentic/docs/guide/context.md',
            }),
          },
        },
      ],
    })
  }

  if (currentStep.value >= 5) {
    result.push({
      role: 'tool',
      name: 'read_file',
      tool_call_id: 'call_read_context_md',
      content: toolResult,
    })

    result.push({
      role: 'user',
      content: userMsg2,
    })
  }

  return result
})

const requestPreview = computed(() => {
  return JSON.stringify(
    {
      model: 'gpt-4.1',
      messages: allMessages.value,
      tools:
        currentStep.value >= 4
          ? [
              {
                type: 'function',
                function: {
                  name: 'read_file',
                  description: 'Read file content by path',
                },
              },
            ]
          : [],
    },
    null,
    2,
  )
})
</script>

<template>
  <section class="aa-context-builder">
    <header class="aa-context-builder__header">
      <h3>{{ isEn ? 'Interactive Context Builder' : '交互式上下文构造器' }}</h3>
      <div class="aa-context-builder__token" :class="tokenClass">
        {{ isEn ? 'Token Usage' : 'Token 用量' }}: {{ currentToken }}
      </div>
    </header>

    <p class="aa-context-builder__lead">
      {{
        isEn
          ? 'Click each step and watch how the request payload expands round by round.'
          : '按步骤点击，观察一次 Agent-LLM 交互里请求体如何一轮轮变长。'
      }}
    </p>

    <div class="aa-context-builder__steps">
      <button
        v-for="(label, index) in steps"
        :key="label"
        type="button"
        class="aa-context-builder__step-btn"
        :class="{ 'is-active': currentStep === index + 1 }"
        @click="currentStep = index + 1"
      >
        {{ label }}
      </button>
    </div>

    <transition-group name="aa-msg" tag="div" class="aa-context-builder__messages">
      <article
        v-for="(message, index) in allMessages"
        :key="`${message.role}-${index}`"
        class="aa-context-builder__message"
        :class="`aa-context-builder__message--${message.role}`"
      >
        <div class="aa-context-builder__message-role">{{ message.role }}</div>
        <pre class="aa-context-builder__message-content">{{ message.content }}</pre>
      </article>
    </transition-group>

    <pre class="aa-context-builder__json"><code>{{ requestPreview }}</code></pre>
  </section>
</template>

<style scoped>
.aa-context-builder {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, transparent 12%);
}

.aa-context-builder__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
  flex-wrap: wrap;
}

.aa-context-builder__header h3 {
  margin: 0;
}

.aa-context-builder__token {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
}

.aa-context-builder__token--green {
  color: #2c9c5a;
}

.aa-context-builder__token--yellow {
  color: #b58900;
}

.aa-context-builder__token--red {
  color: #c0392b;
}

.aa-context-builder__lead {
  margin-top: 0.6rem;
}

.aa-context-builder__steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  margin: 0.8rem 0 1rem;
}

.aa-context-builder__step-btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  text-align: left;
  font-size: 0.84rem;
  cursor: pointer;
}

.aa-context-builder__step-btn.is-active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 28%, transparent 72%);
}

.aa-context-builder__messages {
  display: grid;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}

.aa-context-builder__message {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
}

.aa-context-builder__message-role {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
  margin-bottom: 0.35rem;
  font-family: var(--vp-font-family-mono);
}

.aa-context-builder__message-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  line-height: 1.45;
}

.aa-context-builder__message--system {
  border-color: color-mix(in srgb, #22b8cf 35%, var(--vp-c-divider) 65%);
  color: color-mix(in srgb, #22b8cf 72%, var(--vp-c-text-1) 28%);
}

.aa-context-builder__message--user {
  color: var(--vp-c-text-1);
}

.aa-context-builder__message--assistant {
  border-color: color-mix(in srgb, #2f9e44 35%, var(--vp-c-divider) 65%);
  color: color-mix(in srgb, #2f9e44 76%, var(--vp-c-text-1) 24%);
}

.aa-context-builder__message--tool {
  border-color: color-mix(in srgb, #9c36b5 35%, var(--vp-c-divider) 65%);
  color: color-mix(in srgb, #9c36b5 70%, var(--vp-c-text-1) 30%);
}

.aa-context-builder__json {
  margin: 0;
  max-height: 420px;
  overflow: auto;
  border-radius: 10px;
  padding: 0.8rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  line-height: 1.45;
}

.aa-msg-enter-active {
  transition: all 0.2s ease;
}

.aa-msg-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 640px) {
  .aa-context-builder {
    padding: 0.75rem;
  }

  .aa-context-builder__json {
    max-height: 320px;
    font-size: 0.74rem;
  }
}
</style>
