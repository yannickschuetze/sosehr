<script setup lang="ts">
type Message = {
  id: string
  text: string
  dedication: string | null
  created_at: string
}

const composerOpen = ref(false)
const submitted = ref(false)
const form = reactive({ text: '', dedication: '' })
const formError = ref('')
const sending = ref(false)

const { data: messages, refresh } = await useFetch<Message[]>('/api/messages', {
  default: () => []
})

const bubbleStyle = (message: Message, index: number) => {
  const value = [...message.id].reduce((total, character) => total + character.charCodeAt(0), 0)
  return {
    '--x': `${8 + ((value * 13) % 78)}%`,
    '--y': `${7 + ((value * 29) % 76)}%`,
    '--delay': `${-(index % 8)}s`,
    '--duration': `${15 + (value % 9)}s`
  }
}

const submitMessage = async () => {
  formError.value = ''
  sending.value = true

  try {
    await $fetch('/api/messages', {
      method: 'POST',
      body: form
    })
    submitted.value = true
    form.text = ''
    form.dedication = ''
    await refresh()
  } catch (error: any) {
    formError.value = error?.data?.statusMessage || 'Deine Nachricht konnte gerade nicht gesendet werden.'
  } finally {
    sending.value = false
  }
}

const closeComposer = () => {
  composerOpen.value = false
  submitted.value = false
  formError.value = ''
}
</script>

<template>
  <main>
    <section class="space" aria-labelledby="page-title">
      <header class="masthead">
        <NuxtLink to="/" class="wordmark" aria-label="So sehr — Startseite">so sehr</NuxtLink>
        <button class="quiet-button" type="button" @click="composerOpen = true">
          Etwas hinterlassen
        </button>
      </header>

      <div class="intro">
        <p class="eyebrow">Ein offener Raum für Erinnerungen</p>
        <h1 id="page-title">Für alles, was<br>noch gesagt werden will.</h1>
        <p class="lede">Schreibe ein paar Worte für jemanden, der fehlt. Sie dürfen hier bei anderen Menschen weiteratmen.</p>
      </div>

      <div v-if="messages.length" class="bubble-field" aria-label="Veröffentlichte Nachrichten">
        <article
          v-for="(message, index) in messages"
          :key="message.id"
          class="message-bubble"
          :style="bubbleStyle(message, index)"
        >
          <p>„{{ message.text }}“</p>
          <span v-if="message.dedication">{{ message.dedication }}</span>
        </article>
      </div>

      <div v-else class="empty-space">
        <span aria-hidden="true">✦</span>
        <p>Noch ist es ganz still hier.</p>
        <button type="button" @click="composerOpen = true">Das erste Wort hinterlassen</button>
      </div>

      <p class="space-note">Jede Nachricht wird behutsam gelesen, bevor sie ihren Platz im Raum findet.</p>
    </section>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="composerOpen" class="dialog-backdrop" @click.self="closeComposer">
          <section class="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title">
            <button class="close-button" type="button" aria-label="Fenster schließen" @click="closeComposer">×</button>

            <template v-if="!submitted">
              <p class="eyebrow">Ein paar Worte</p>
              <h2 id="composer-title">Was möchtest du<br>noch sagen?</h2>
              <form @submit.prevent="submitMessage">
                <label for="message">Deine Nachricht</label>
                <textarea id="message" v-model.trim="form.text" maxlength="700" required placeholder="Ich denke an dich …" />
                <div class="form-row">
                  <div>
                    <label for="dedication">Für wen? <em>optional</em></label>
                    <input id="dedication" v-model.trim="form.dedication" maxlength="80" placeholder="für Mama" />
                  </div>
                  <span>{{ form.text.length }}/700</span>
                </div>
                <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
                <button class="send-button" type="submit" :disabled="sending">
                  {{ sending ? 'Wird bewahrt …' : 'Nachricht hinterlassen' }}
                </button>
              </form>
              <p class="form-note">Deine Nachricht wird vor der Veröffentlichung persönlich geprüft.</p>
            </template>

            <div v-else class="thank-you">
              <span aria-hidden="true">✦</span>
              <h2>Deine Worte<br>sind angekommen.</h2>
              <p>Wir lesen sie in Ruhe und geben ihnen bald ihren Platz.</p>
              <button class="quiet-button" type="button" @click="closeComposer">Zurück in den Raum</button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
