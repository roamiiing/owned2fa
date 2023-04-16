<script setup lang="ts">
  import { PlusIcon, QrCodeIcon, PencilIcon } from '@heroicons/vue/24/outline'
  import { useToggle } from '@vueuse/shared'
  import { watchEffect } from 'vue'
  import BaseButton from '@/components/base-button.vue'
  import TotpCard from '@/components/totp-card.vue'
  import { useTotpStore } from '@/stores/totp'
  import CustomTransition from '@/components/custom-transition.vue'

  const ADD_ROUTES = [
    {
      name: 'Scan',
      icon: QrCodeIcon,
      to: '/scan',
    },
    {
      name: 'Manual',
      icon: PencilIcon,
      to: '/add',
    },
  ]

  const { totpList, copyCode } = useTotpStore()

  const [toggled, toggle] = useToggle()

  watchEffect(cleanup => {
    if (toggled.value) {
      const timeout = setTimeout(toggle, 5000)

      cleanup(() => clearTimeout(timeout))
    }
  })
</script>

<template>
  <div>
    <TotpCard
      v-for="totp in totpList"
      :key="totp.id"
      :totp="totp"
      @copy="copyCode(totp.id)"
    />

    <p v-if="!totpList.length" class="w-full text-center text-surface-400">
      No TOTP's added yet
    </p>

    <Teleport to="#modal">
      <div class="fixed bottom-0 left-0 w-full">
        <CustomTransition type="pop">
          <div v-if="!toggled" class="absolute bottoms-4 lmd:left-4 right-4">
            <BaseButton
              class="w-full md:hidden"
              variant="primary"
              @click="toggle"
            >
              <template #icon>
                <PlusIcon class="w-6 h-6" />
              </template>
              Add
            </BaseButton>

            <BaseButton class="hidden md:block" circle center @click="toggle">
              <template #icon>
                <PlusIcon class="w-6 h-6 mx-auto" />
              </template>
            </BaseButton>
          </div>

          <div
            v-else
            class="absolute bottoms-4 lmd:left-4 right-4 flex gap-3 flex-row md:flex-col md:max-w-xs"
          >
            <RouterLink
              v-for="{ name, icon, to } in ADD_ROUTES"
              custom
              :to="to"
              v-slot="{ href, navigate }"
            >
              <BaseButton
                tag="a"
                :href="href"
                class="w-full"
                variant="primary"
                @click="navigate"
              >
                <template #icon>
                  <component :is="icon" class="w-6 h-6" />
                </template>
                {{ name }}
              </BaseButton>
            </RouterLink>
          </div>
        </CustomTransition>
      </div>
    </Teleport>
  </div>
</template>
