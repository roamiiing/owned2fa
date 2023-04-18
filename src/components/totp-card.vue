<script setup lang="ts">
  import { DURATION, getMsLeft } from '@/domain/generator'
  import type { Totp } from '@/domain/totp'
  import { ClipboardIcon, PencilIcon } from '@heroicons/vue/24/outline'
  import { ref, watch } from 'vue'
  import { useEventListener, useTimeoutFn } from '@vueuse/core'

  const props = defineProps<{
    totp: Totp
  }>()

  const emit = defineEmits<{
    (event: 'copy'): void
  }>()

  const msLeft = ref(0)

  const width = ref(0)

  const resetWidth = () => {
    msLeft.value = getMsLeft(props.totp.code.expiresAt)
    width.value = msLeft.value / DURATION / 1000
  }

  resetWidth()

  watch(() => props.totp.code.expiresAt, resetWidth)

  watch(
    () => width.value,
    (value, _, cleanup) => {
      if (value > 0) {
        const timeout = setTimeout(() => {
          width.value = 0
        }, 100)

        cleanup(() => clearTimeout(timeout))
      }
    },
    { immediate: true },
  )

  // https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#Inactive_tabs
  useEventListener(document, ['visibilitychange', 'focus'], () => {
    if (document.visibilityState === 'visible') {
      resetWidth()
    }
  })
</script>

<template>
  <div
    class="relative w-full cursor-pointer bg-backround px-3 py-2 rounded-lg border border-surface-200 flex items-center justify-between overflow-hidden"
    @click="emit('copy')"
  >
    <div
      class="absolute -z-[1] top-0 left-0 h-full bg-primary-lightest dark:bg-primary-darkest"
      :style="{
        width: `${width * 100}%`,
        transition: width === 0 ? `width ${msLeft}ms linear` : 'none',
      }"
    />

    <div class="flex-1">
      <p class="text-xs text-surface-700 select-none">{{ totp.name }}</p>
      <pre class="text-xl text-surface-900">{{ totp.code.code }}</pre>
    </div>

    <ClipboardIcon class="w-6 h-6 mr-3 text-surface-700" />

    <RouterLink :to="`/${totp.id}`">
      <PencilIcon class="w-6 h-6 text-surface-700" />
    </RouterLink>
  </div>
</template>
