<script setup lang="ts">
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
  const { getTotp, updateTotpFields, copyCode } = useTotpStore()

  const currentId = computed(() => route.params.id as string)
  const currentTotp = computed(() => getTotp(currentId.value))
  const currentCode = computed(() => currentTotp.value!.code)

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

  const secondsLeft = ref(0)

  watch(
    currentCode,
    (value, _old) => {
      secondsLeft.value = Math.ceil(getMsLeft(value.expiresAt) / 1000)
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
      <pre
        class="text-4xl text-primary cursor-pointer select-none"
        @click="copy"
        >{{ currentCode.code }}</pre
      >
      <p
        class="text-sm font-light select-none"
        :class="secondsLeft <= 10 ? 'text-error' : 'text-gray-500'"
      >
        Expires in {{ secondsLeft }} seconds
      </p>
    </div>

    <form class="w-full flex flex-col space-y-3" @submit.prevent="submitForm">
      <BaseInput label="Name" v-bind="name" />
      <BaseInput label="Secret" v-bind="secret" type="password" />

      <BaseInput label="Issuer" v-bind="issuer" />
      <BaseInput label="Username" v-bind="username" />

      <BaseButton type="submit">Save</BaseButton>
    </form>

    <Teleport to="#modal">
      <div class="fixed bottom-4 left-4 right-4">
        <BaseButton class="w-full" @click="copy">Copy</BaseButton>
      </div>
    </Teleport>
  </div>
</template>
