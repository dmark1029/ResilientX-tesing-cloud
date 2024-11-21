<script lang="ts">
import { defineComponent } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { axios } from '/@src/axios'

export default defineComponent({
  data() {
    return {
      context: '',
      question: '',
      loading: false,
      typed: false,
      finished: true,
      error: '',
      interrupt: null,
      history: [],
      available: false,
    }
  },
  mounted() {
    this.checkIsActive()

    marked.use({
      mangle: false,
      headerIds: false,
    })
  },
  methods: {
    checkIsActive() {
      axios.get('/ai/available').then((response) => {
        response.status === 200 ? (this.available = true) : (this.available = false)
      })
    },
    processQuestion() {
      if (this.question.trim() === '') return

      this.interrupt = new AbortController()
      this.loading = true
      this.finished = false
      this.error = ''

      this.history.push({
        question: this.question,
        answer: '',
        hidden: '',
      })

      const q = this.question
      this.question = ''

      this.postRequest(q)
        .then(async (response) => {
          await this.getResponse(response, (parsedResponse) => {
            let word = parsedResponse.response
            if (parsedResponse.done) {
              this.context = parsedResponse.context
              this.finished = true
            }

            // add word to response
            if (word != undefined) {
              this.history[this.history.length - 1].hidden += word
              this.history[this.history.length - 1].answer = DOMPurify.sanitize(
                marked.parse(this.history[this.history.length - 1].hidden)
              )
            }
          })
        })
        .then(() => {
          this.loading = false
        })
        .catch((error) => {
          if (!error.message.includes('BodyStreamBuffer was aborted')) {
            this.history[this.history.length - 1].answer =
              'An error occurred. Please try again.'
            this.error = 'An error occurred. Please try again.'
          }
          this.finished = true
          this.loading = false
        })
    },
    postRequest(question) {
      const URL = import.meta.env.VITE_API_HOST + '/ai/ask'

      return fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
          context: this.context,
          question: question,
        }),
        signal: this.interrupt.signal,
      })

      return axios.post(
        `/ai/ask`,
        {
          context: this.context,
          question: question,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: this.interrupt.signal,
          responseType: 'stream', // Setting responseType to 'stream' to stream the response
        }
      )

      return axios(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + this.token,
        },
        body: JSON.stringify({
          context: this.context,
          question: question,
        }),
        signal: this.interrupt.signal,
      })
    },

    async getResponse(response, callback) {
      const reader = response.body.getReader()
      let partialLine = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        const textChunk = new TextDecoder().decode(value)
        const lines = (partialLine + textChunk).split('\n')
        partialLine = lines.pop()

        for (const line of lines) {
          if (line.trim() === '') continue
          const parsedResponse = JSON.parse(line)
          callback(parsedResponse)
        }
      }

      if (partialLine.trim() !== '') {
        const parsedResponse = JSON.parse(partialLine)
        callback(parsedResponse)
      }
    },
    stopAsking() {
      this.interrupt.abort('Stop button pressed')
    },
  },
})
</script>

<template>
  <div v-if="available">
    <div>
      <div class="chat-container">
        <div v-for="item in history" :key="item.question" class="chat">
          <div class="question">
            <div class="question-person">You</div>
            <div v-text="item.question"></div>
          </div>
          <div class="answer">
            <div class="answer-bot">AI</div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              v-if="item.answer"
              v-dompurify-html="item.answer"
              class="question-answer"
            ></div>
            <div v-else class="question-answer">Thinking..</div>
          </div>
        </div>
      </div>
    </div>

    <div class="form">
      <form @submit.stop.prevent="processQuestion">
        <div class="field">
          <label class="label">Question</label>
          <div class="control">
            <textarea
              v-model="question"
              type="text"
              class="textarea"
              placeholder="Enter your question"
            />
          </div>
        </div>

        <button type="submit" class="button v-button is-primary" :disabled="!finished">
          Submit
        </button>
        <button
          type="button"
          class="button v-button is-danger mt-0 ml-3"
          @click="stopAsking"
        >
          Stop
        </button>
      </form>

      <span v-if="error"> Error: {{ error }} </span>

      <span v-if="loading"> Processing... </span>
    </div>
  </div>
  <div v-else>
    <div>
      <p>AI service is not available at the moment. Please try again later.</p>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.chat {
  margin-bottom: 30px;
}

.question {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.question-person {
  background-color: #a3cfbb;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  margin-right: 10px;
  height: 35px;
}

.answer {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.question-answer {
}

.answer-bot {
  background-color: #1a1d20;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  margin-right: 10px;
  height: 35px;
}

.answer {
  border-radius: 10px;
}

.answer p {
  margin: 5px 0;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.stop-button {
  margin-top: 10px;
  display: inline-block;
  width: auto;
  background: #bb2d3b;
  border: #bb2d3b 1px solid;
}
</style>