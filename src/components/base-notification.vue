<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import {
    CheckIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline'
  import type { NotificationAction } from '@/utils/notifications'
  import BaseButton from './base-button.vue'

  const props = defineProps<{
    duration: number
    text: string
    type: 'error' | 'success' | 'info' | 'warning'
    actions: NotificationAction[]
  }>()

  const emit = defineEmits<{
    (event: 'close'): void
  }>()

  const isInfinite = computed(() => props.duration === Infinity)

  const close = () => emit('close')

  const icon = computed(() => {
    switch (props.type) {
      case 'success': {
        return CheckIcon
      }
      case 'error': {
        return ExclamationTriangleIcon
      }
      case 'warning': {
        return ExclamationTriangleIcon
      }
      case 'info': {
        return null
      }
    }
  })

  const startCounter = ref(false)

  onMounted(() => {
    setTimeout(() => (startCounter.value = true), 100)
  })
</script>

<template>
  <div
    class="bg-opaque-background shadow-md backdrop-blur-md text-sm py-2 px-3 rounded-md relative overflow-hidden flex flex-col space-y-2"
  >
    <div class="flex flex-row space-x-3">
      <div
        v-if="icon"
        class="place-self-center"
        :class="{
          'text-success-lighter': type === 'success',
          'text-error-lighter': type === 'error',
          'text-secondary-lighter': type === 'warning',
          'text-primary-lightest': type === 'info',
        }"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
      <p class="text-surface-700 flex-1 place-self-center">{{ text }}</p>

      <div
        class="cursor-pointer w-5 h-5 text-surface-400 hover:text-surface-600 transition-colors duration-150"
        role="button"
        @click="close"
      >
        <XMarkIcon class="w-5 h-5" />
      </div>
    </div>

    <div v-if="actions.length > 0" class="ml-9">
      <div
        v-for="{ key, text, callback } in actions"
        :key="key"
        role="button"
        class="h-6 w-fit bg-primary text-surface-50 inline-block px-3 rounded-lg media-hover:hover:bg-primary-darker transition-colors duration-200"
        @click="callback"
      >
        {{ text }}
      </div>
    </div>

    <div
      class="absolute top-0 -left-3 h-0.5 w-full !m-0"
      :style="!isInfinite ? { transition: `width ${duration}ms linear` } : {}"
      :class="{
        'bg-success-lighter': type === 'success',
        'bg-error-lighter': type === 'error',
        'bg-secondary-lighter': type === 'warning',
        'bg-primary-lightest': type === 'info',
        '!w-0': startCounter,
      }"
    />
  </div>
</template>
