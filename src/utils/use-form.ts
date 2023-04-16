import { computed, ref, type ComputedRef, type Ref } from 'vue'

import { ValidationStatus, type Validator } from './validation'
import { exists } from './guards'

const V_MODEL_VALUE_PROP = 'modelValue'
const V_MODEL_EVENT_PROP = 'onUpdate:modelValue'

const executeOrGet = <T>(value: T | (() => T)): T => {
  return typeof value === 'function' ? (value as () => T)() : value
}

export const enum FormFieldType {
  Input = 'input',
  InputNumber = 'inputNumber',
  Multipicker = 'multipicker',
  Picker = 'picker',
}

type FormFieldOptions<T, F extends FormFieldType, O = {}> = O & {
  type: F
  initialValue?: T | (() => T)
  validator?: Validator<T, any>
  /**
   * @default false
   */
  immediate?: boolean
}

type FormFieldBinding<T, B = {}> = B & {
  [V_MODEL_VALUE_PROP]: T
  [V_MODEL_EVENT_PROP]: (value?: T, manuallyChanged?: boolean) => unknown
}

type WithRequirement<T = {}> = T & {
  requirementNotSatisfied: boolean
}

type WithExceeded<T = {}> = T & {
  exceeded: boolean
}

type WithBoundaries<T = {}> = T & {
  min?: number
  max?: number
}

type WithValidation<T = {}> = T & {
  validationStatus: ValidationStatus
}

type WithError<T = {}> = T & {
  errorString?: string
}

type FormInputFieldType = string
type FormInputFieldOptions = FormFieldOptions<
  FormInputFieldType,
  FormFieldType.Input
>
type FormInputFieldBinding = FormFieldBinding<
  FormInputFieldType,
  WithRequirement & WithValidation & WithError
>

type FormInputNumberFieldType = number
type FormInputNumberFieldOptions = FormFieldOptions<
  FormInputNumberFieldType,
  FormFieldType.InputNumber
>
type FormInputNumberFieldBinding = FormFieldBinding<
  FormInputNumberFieldType,
  WithExceeded & WithBoundaries & WithRequirement & WithValidation & WithError
>

type FormMultipickerFieldType = string[]
type FormMultipickerFieldOptions = FormFieldOptions<
  FormMultipickerFieldType,
  FormFieldType.Multipicker
>
type FormMultipickerFieldBinding = FormFieldBinding<
  FormMultipickerFieldType,
  WithExceeded & WithError
>

type FormPickerFieldType = string
type FormPickerFieldOptions = FormFieldOptions<
  FormPickerFieldType,
  FormFieldType.Picker
>
type FormPickerFieldBinding = FormFieldBinding<
  FormPickerFieldType,
  WithRequirement
>

type FormFieldResultOptions<T extends FormFieldType> =
  T extends FormFieldType.Input
    ? FormInputFieldOptions
    : T extends FormFieldType.InputNumber
    ? FormInputNumberFieldOptions
    : T extends FormFieldType.Multipicker
    ? FormMultipickerFieldOptions
    : T extends FormFieldType.Picker
    ? FormPickerFieldOptions
    : never

type FormFieldResultBinding<T extends FormFieldType> =
  T extends FormFieldType.Input
    ? FormInputFieldBinding
    : T extends FormFieldType.InputNumber
    ? FormInputNumberFieldBinding
    : T extends FormFieldType.Multipicker
    ? FormMultipickerFieldBinding
    : T extends FormFieldType.Picker
    ? FormPickerFieldBinding
    : never

type InferFieldType<T> = [T] extends [
  {
    type: infer F
  },
]
  ? F
  : never

type InferFieldStateType<T> = [T] extends [
  {
    type: infer F
  },
]
  ? F extends FormFieldType.Input
    ? FormInputFieldType
    : F extends FormFieldType.InputNumber
    ? FormInputNumberFieldType
    : F extends FormFieldType.Multipicker
    ? FormMultipickerFieldType
    : F extends FormFieldType.Picker
    ? FormPickerFieldType
    : never
  : never

type ExtractFieldTypes<O extends UseFormFieldsOption> = {
  [key in keyof O]: InferFieldType<O[key]>
}

type ExtractFieldStateTypes<O extends UseFormFieldsOption> = {
  [key in keyof O]: InferFieldStateType<O[key]>
}

type UseFormFieldsOption = Record<string, FormFieldResultOptions<FormFieldType>>

type UseFormOptions<
  F extends UseFormFieldsOption,
  S extends ExtractFieldStateTypes<F>,
> = {
  onSubmitted?(state: S): Promise<void> | void
  fields: F
  state?: Ref<Partial<S>>
}

type UseFormResult<
  F extends UseFormFieldsOption,
  T extends ExtractFieldTypes<F>,
  S extends ExtractFieldStateTypes<F>,
> = {
  submitForm(): Promise<void>
  isLoading: ComputedRef<boolean>
  state: ComputedRef<S>
  bindings: {
    [key in keyof T]: ComputedRef<
      FormFieldResultBinding<T[key] extends FormFieldType ? T[key] : never>
    >
  }
}

type ValidObjectKeys = string | number | symbol

type ValidationState = Record<ValidObjectKeys, boolean>

export const useForm = <
  F extends UseFormFieldsOption,
  T extends ExtractFieldTypes<F> = ExtractFieldTypes<F>,
  S extends ExtractFieldStateTypes<F> = ExtractFieldStateTypes<F>,
>({
  onSubmitted,
  fields,
  state = ref({}),
}: UseFormOptions<F, S>): UseFormResult<F, T, S> => {
  const validationState = ref<ValidationState>({})
  const changesState = ref<ValidationState>({})
  const isAllValid = computed(() =>
    Object.keys(fields).every(key => validationState.value[key]),
  )

  const isLoading = ref(false)
  const isFormSubmitted = ref(false)

  const submitForm = async () => {
    isFormSubmitted.value = true

    if (isAllValid.value) {
      isLoading.value = true
      await onSubmitted?.(state.value as S)
      isLoading.value = false
    }
  }

  const bindings = Object.fromEntries(
    Object.entries(fields).map(entry => {
      const key = entry[0] as keyof F
      const { initialValue, validator, immediate, type } =
        entry[1] as F[keyof F]

      const executedInitialValue = executeOrGet(initialValue) as S[keyof S]
      const hasInitialValue = exists(executedInitialValue)
      const hadValue = exists(state.value[key])

      if (!hadValue && hasInitialValue) {
        state.value[key] = executedInitialValue
      }

      const modelValue = computed(() => state.value[key])

      const doValidate = computed(() => {
        return (
          isFormSubmitted.value ||
          (modelValue.value !== undefined && modelValue.value !== null)
        )
      })
      const validationResult = ref<
        ReturnType<Validator<unknown, unknown>> | undefined
      >()

      const onUpdate = (value: S[keyof S], manuallyChanged = true) => {
        if (
          type === FormFieldType.Multipicker ||
          type === FormFieldType.InputNumber
        ) {
          changesState.value[key] = true

          const validated = validator?.(value, state.value)

          if (exists(validated)) {
            if (
              (type === FormFieldType.Multipicker &&
                validated.maximumExceeded) ||
              (type === FormFieldType.InputNumber &&
                !manuallyChanged &&
                (validated.maximumExceeded || validated.minimumExceeded))
            ) {
              validationResult.value = {
                ...validated,
                validationStatus: ValidationStatus.Valid,
              }
              // If boundaries exceeded we need to display error message and prevent from updating state
              // Could be refactored
              return
            } else {
              validationResult.value = undefined
            }
          }
        }

        state.value[key] = value === '' ? undefined : (value as S[keyof S])
      }

      const comp = computed(() => {
        const validated =
          validationResult.value ??
          validator?.(state.value[key] as S[keyof S], state.value)
        validationState.value[key] = !validationResult.value
          ? validated
            ? validated.requirementSatisfied &&
              validated.validationStatus === ValidationStatus.Valid
            : true
          : true

        const binding = {
          modelValue: modelValue.value,
          'onUpdate:modelValue': onUpdate,

          ...(type !== FormFieldType.Picker
            ? {
                errorString: doValidate.value
                  ? validated?.errorMessage
                  : undefined,
              }
            : {}),

          ...(type !== FormFieldType.Picker &&
          type !== FormFieldType.Multipicker
            ? {
                validationStatus:
                  immediate || doValidate.value
                    ? validated?.validationStatus
                    : ValidationStatus.NotValidated,
              }
            : {}),

          ...(type === FormFieldType.Input ||
          type === FormFieldType.InputNumber ||
          type === FormFieldType.Picker
            ? {
                requirementNotSatisfied: doValidate.value
                  ? !validated?.requirementSatisfied
                  : false,
              }
            : {}),

          ...(type === FormFieldType.Multipicker ||
          type === FormFieldType.InputNumber
            ? {
                exceeded:
                  (type === FormFieldType.Multipicker &&
                    validated?.maximumExceeded) ||
                  (type === FormFieldType.InputNumber &&
                    (validated?.maximumExceeded || validated?.minimumExceeded)),
              }
            : {}),
        }

        return binding
      })

      return [key, comp]
    }),
  )

  return {
    submitForm,
    isLoading: computed(() => isLoading.value),
    state: computed(() => state.value as S),
    // @ts-ignore
    bindings,
  }
}
