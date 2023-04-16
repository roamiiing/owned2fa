<script setup lang="ts">
  import BaseInput from '@/components/base-input.vue'
  import BaseButton from '@/components/base-button.vue'
  import {
    TotpIssuerValidator,
    TotpNameValidator,
    TotpSecretValidator,
    TotpUsernameValidator,
    createTotp,
  } from '@/domain/totp'
  import { FormFieldType, useForm } from '@/utils/use-form'
  import { useTotpStore } from '@/stores/totp'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const { addTotp } = useTotpStore()

  const {
    bindings: { name, secret, username, issuer },
    submitForm,
  } = useForm({
    onSubmitted(state) {
      addTotp(createTotp(state))
      router.push('/')
    },
    fields: {
      name: {
        type: FormFieldType.Input,
        validator: TotpNameValidator,
        required: true,
      },
      secret: {
        type: FormFieldType.Input,
        validator: TotpSecretValidator,
        required: true,
      },
      issuer: {
        type: FormFieldType.Input,
        validator: TotpIssuerValidator,
      },
      username: {
        type: FormFieldType.Input,
        validator: TotpUsernameValidator,
      },
    },
  })
</script>

<template>
  <form class="w-full flex flex-col space-y-3" @submit.prevent="submitForm">
    <BaseInput label="Name" v-bind="name" />
    <BaseInput label="Secret" v-bind="secret" />

    <BaseInput label="Issuer" v-bind="issuer" />
    <BaseInput label="Username" v-bind="username" />

    <BaseButton type="submit">Submit</BaseButton>
  </form>
</template>
