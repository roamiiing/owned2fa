<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RouterView } from 'vue-router'
  import BaseHeader from '@/components/base-header.vue'
  import CustomTransition from '@/components/custom-transition.vue'
  import AppNotifications from '@/containers/app-notifications.vue'
  import { useNotify } from '@/stores/notifications'
  import { NotificationType } from '@/utils/notifications'

  import { registerSW } from 'virtual:pwa-register'

  const notify = useNotify()

  onMounted(() => {
    if (!import.meta.env.PROD) {
      return
    }

    const updateSW = registerSW({
      onNeedRefresh() {
        notify({
          text: 'An update is available',
          type: NotificationType.Warning,
          duration: Infinity,
          actions: [
            {
              key: 'install-update',
              text: 'Install',
              callback() {
                updateSW()
              },
            },
          ],
        })
      },
    })
  })
</script>

<template>
  <div>
    <BaseHeader class="sticky top-0 z-10" />

    <main class="container mx-auto max-w-lg px-4 pt-3 pb-32 h-full">
      <CustomTransition type="up">
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </CustomTransition>
    </main>

    <Teleport to="#modal">
      <AppNotifications class="fixed z-20 top-0 left-0 w-full" />
    </Teleport>
  </div>
</template>
