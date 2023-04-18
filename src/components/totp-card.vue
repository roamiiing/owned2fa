<script setup lang="ts">
  import { DURATION, getMsLeft } from '@/domain/generator'
  import type { Totp } from '@/domain/totp'
  import { ClipboardIcon, PencilIcon } from '@heroicons/vue/24/outline'
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    totp: Totp
  }>()

  const emit = defineEmits<{
    (event: 'copy'): void
  }>()

  const msLeft = computed(() => getMsLeft(props.totp.code.expiresAt))

  const initialPercentage = computed(() => {
    return msLeft.value / DURATION / 1000
  })

  const width = ref(initialPercentage.value)

  watch(
    () => initialPercentage.value,
    (value, _old, cleanup) => {
      width.value = value

      const timeout = setTimeout(() => {
        width.value = 0
      }, 100)

      cleanup(() => clearTimeout(timeout))
    },
    { immediate: true },
  )
</script>

<template>
  <div
    class="relative w-full cursor-pointer bg-backround px-3 py-2 rounded-lg border border-surface-200 flex items-center justify-between overflow-hidden"
    @click="emit('copy')"
  >
    <div
      class="absolute -z-[1] top-0 left-0 h-full opacity-50 bg-surface-100"
      :style="{
        width: `${width * 100}%`,
        transition: width === 0 ? `width ${msLeft}ms linear` : 'none',
      }"
    />

    <div class="flex-1">
      <p class="text-xs text-surface-400 select-none">{{ totp.name }}</p>
      <pre class="text-xl">{{ totp.code.code }}</pre>
    </div>

    <ClipboardIcon class="w-6 h-6 mr-3 text-surface-400" />

    <RouterLink :to="`/${totp.id}`">
      <PencilIcon class="w-6 h-6 text-surface-400" />
    </RouterLink>
  </div>
</template>
