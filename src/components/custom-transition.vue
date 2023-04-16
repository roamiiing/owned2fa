<template>
  <Transition v-bind="classes">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      type?: 'up' | 'bottom' | 'pop'
    }>(),
    {
      type: 'up',
    },
  )

  const classes = computed(() => {
    const { type } = props
    if (type === 'up') {
      return {
        enterActiveClass: 'duration-100 ease-out',
        enterFromClass: 'transform opacity-0 translate-y-1/3',
        enterToClass: 'opacity-100',
        leaveActiveClass: 'duration-100 ease-in',
        leaveFromClass: 'opacity-100',
        leaveToClass: 'transform opacity-0 -translate-y-1/3',
      }
    }

    if (type === 'bottom') {
      return {
        enterActiveClass: 'duration-100 ease-out',
        enterFromClass: 'transform opacity-0 -translate-y-1/3',
        enterToClass: 'opacity-100',
        leaveActiveClass: 'duration-100 ease-in',
        leaveFromClass: 'opacity-100',
        leaveToClass: 'transform opacity-0 -translate-y-1/3',
      }
    }

    if (type === 'pop') {
      return {
        enterActiveClass: 'duration-200 transform ease-out',
        enterFromClass: 'transform opacity-0 scale-[0.3]',
        enterToClass: 'opacity-100 scale-100',
        leaveActiveClass: 'duration-100 transform ease-in',
        leaveFromClass: 'opacity-100 scale-100',
        leaveToClass: 'transform opacity-0 scale-[0.3]',
      }
    }

    return null
  })
</script>
