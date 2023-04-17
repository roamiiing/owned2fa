<script setup lang="ts">
  import {
    CheckIcon,
    ClipboardIcon,
    TrashIcon,
  } from '@heroicons/vue/24/outline'
  import BaseInput from '@/components/base-input.vue'
  import BaseButton from '@/components/base-button.vue'
  import {
    TotpIssuerValidator,
    TotpNameValidator,
    TotpSecretValidator,
    TotpUsernameValidator,
  } from '@/domain/totp'
  import { FormFieldType, useForm } from '@/utils/use-form'
  import { useTotpStore } from '@/stores/totp'
  import { useRoute, useRouter } from 'vue-router'
  import { computed, ref, watch } from 'vue'
  import { getMsLeft } from '@/domain/generator'
  import { useIntervalFn } from '@vueuse/core'

  const route = useRoute()
  const router = useRouter()
  const { getTotp, updateTotpFields, copyCode, removeTotp } = useTotpStore()

  const currentId = computed(() => route.params.id as string)
  const currentTotp = computed(() => getTotp(currentId.value))
  const currentCode = computed(() => currentTotp.value?.code)

  const {
    bindings: { name, secret, username, issuer },
    submitForm,
  } = useForm({
    onSubmitted(state) {
      updateTotpFields(currentId.value, state)
      router.push('/')
    },
    fields: {
      name: {
        type: FormFieldType.Input,
        validator: TotpNameValidator,
        initialValue: currentTotp.value?.name,
        required: true,
      },
      secret: {
        type: FormFieldType.Input,
        validator: TotpSecretValidator,
        initialValue: currentTotp.value?.secret,
        required: true,
      },
      issuer: {
        type: FormFieldType.Input,
        validator: TotpIssuerValidator,
        initialValue: currentTotp.value?.issuer,
      },
      username: {
        type: FormFieldType.Input,
        validator: TotpUsernameValidator,
        initialValue: currentTotp.value?.username,
      },
    },
  })

  const copy = () => {
    copyCode(currentTotp.value!.id)
  }

  const deleteTotp = () => {
    console.log('DELETING')
    removeTotp(currentId.value)
    router.push('/')
  }

  const secondsLeft = ref(0)

  watch(
    currentCode,
    (value, _old) => {
      if (value) {
        secondsLeft.value = Math.ceil(getMsLeft(value.expiresAt) / 1000)
      }
    },
    { immediate: true },
  )

  useIntervalFn(() => {
    secondsLeft.value--
  }, 1000)
</script>

<template>
  <div class="w-full flex flex-col space-y-5">
    <div class="w-full flex flex-col space-y-3 text-center">
      <p
        class="text-sm font-light select-none mt-16 text-surface-400 hidden md:block"
      >
        Click to copy
      </p>
      <pre
        class="text-4xl md:text-5xl text-primary cursor-pointer select-none"
        @click="copy"
        >{{ currentCode?.code }}</pre
      >
      <p
        class="text-sm font-light select-none"
        :class="secondsLeft <= 10 ? 'text-error' : 'text-surface-400'"
      >
        Expires in {{ secondsLeft }} seconds
      </p>
    </div>

    <form class="w-full flex flex-col space-y-3" @submit.prevent="submitForm">
      <BaseInput label="Name" v-bind="name" />
      <BaseInput label="Secret" v-bind="secret" type="password" />

      <BaseInput label="Issuer" v-bind="issuer" />
      <BaseInput label="Username" v-bind="username" />

      <div class="w-full flex flex-row space-x-3">
        <BaseButton class="w-full" type="submit">
          <template #icon>
            <CheckIcon class="w-6 h-6" />
          </template>

          Save
        </BaseButton>
        <BaseButton
          class="flex-shrink-0"
          circle
          variant="error"
          @click="deleteTotp"
        >
          <template #icon>
            <TrashIcon class="w-6 h-6" />
          </template>
        </BaseButton>
      </div>
    </form>

    <Teleport to="#modal">
      <div class="fixed bottoms-6 left-4 right-4 md:hidden">
        <BaseButton class="w-full" @click="copy">
          <template #icon>
            <ClipboardIcon class="w-5 h-5" />
          </template>
          Copy
        </BaseButton>
      </div>
    </Teleport>
  </div>
</template>
