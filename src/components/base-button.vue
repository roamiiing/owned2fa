<template>
  <component
    :is="tag"
    class="group relative h-12 select-none overflow-hidden transition-all duration-100 active:translate-y-0.5 active:shadow-none cursor-pointer touch-manipulation"
    :class="[
      {
        'flex items-center justify-center': center,
        'px-7': padding && !circle,
        'shadow-lg media-hover:hover:shadow-sm active:shadow-sm':
          shadow && !outline && !semitransparent,
        border: outline,
        'w-12 rounded-full': circle,
        'rounded-xl': !circle,
      },
      !custom &&
        (outline
          ? {
              'border-primary text-primary media-hover:hover:border-primary-darker media-hover:hover:text-primary-darker':
                variant === 'primary',
              'border-secondary text-secondary media-hover:hover:border-secondary-darker media-hover:hover:text-secondary-darker':
                variant === 'secondary',
              'border-error text-error media-hover:hover:border-error-darker media-hover:hover:text-error-darker':
                variant === 'error',
              'border-success text-success media-hover:hover:border-success-darker media-hover:hover:text-success-darker':
                variant === 'success',
            }
          : {
              'bg-primary text-white media-hover:hover:bg-primary-darker':
                variant === 'primary',
              'bg-secondary text-surface-700 media-hover:hover:bg-secondary-darker':
                variant === 'secondary',
              'bg-error text-white media-hover:hover:bg-error-darker':
                variant === 'error',
              'bg-success text-white media-hover:hover:bg-success-darker':
                variant === 'success',
              'bg-opacity-80': semitransparent,
            }),
    ]"
    @touchstart.passive="undefined"
  >
    <template v-if="!!$slots.icon && !isLoading">
      <div :class="{ 'mr-3': !circle }">
        <slot name="icon"></slot>
      </div>
      <slot></slot>
    </template>

    <template v-else-if="!isLoading">
      <slot></slot>
    </template>

    <CubeIcon v-else class="w-6 h-6 animate-spin" />
  </component>
</template>

<script setup lang="ts">
  import { CubeIcon } from '@heroicons/vue/24/solid'

  export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'error' | 'success'
    tag?: 'a' | 'div' | 'button'
    shadow?: boolean
    center?: boolean
    padding?: boolean
    outline?: boolean
    semitransparent?: boolean
    circle?: boolean
    isLoading?: boolean
    custom?: boolean
  }

  withDefaults(defineProps<ButtonProps>(), {
    variant: 'primary',
    tag: 'button',
    shadow: true,
    center: true,
    padding: true,
    outline: false,
    semitransparent: false,
    circle: false,
  })
</script>

<style>
  :root {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
