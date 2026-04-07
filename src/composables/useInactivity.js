import { ref, onMounted, onUnmounted } from 'vue'

export function useInactivity(timeout = 180000, onIdle) {
  const remaining = ref(Math.floor(timeout / 1000))
  let timer = null
  let countdown = null

  function resetTimer() {
    remaining.value = Math.floor(timeout / 1000)
    clearTimeout(timer)
    clearInterval(countdown)
    timer = setTimeout(() => {
      onIdle()
    }, timeout)
    countdown = setInterval(() => {
      remaining.value = Math.max(0, remaining.value - 1)
    }, 1000)
  }

  const EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click']

  onMounted(() => {
    resetTimer()
    EVENTS.forEach(e => document.addEventListener(e, resetTimer, { passive: true }))
  })

  onUnmounted(() => {
    clearTimeout(timer)
    clearInterval(countdown)
    EVENTS.forEach(e => document.removeEventListener(e, resetTimer))
  })

  return { remaining, resetTimer }
}
