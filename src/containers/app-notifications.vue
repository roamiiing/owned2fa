<template>
  <TransitionGroup
    enter-active-class="absolute transform-gpu opacity-0 -translate-y-full"
    leave-active-class="absolute transform-gpu"
    leave-to-class="opacity-0 -translate-x-full"
    tag="aside"
    class="p-4 pb-0 space-y-3 max-w-md"
  >
    <BaseNotification
      v-for="{ id, type, text, duration } in reversed"
      :key="id"
      class="transition-all duration-300"
      :type="type"
      :text="text"
      :duration="duration"
      @close="store.removeNotification(id)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import BaseNotification from '@/components/base-notification.vue'
  import { useNotificationsStore } from '@/stores/notifications'

  const store = useNotificationsStore()

  const reversed = computed(() => [...store.notifications].reverse())
</script>
