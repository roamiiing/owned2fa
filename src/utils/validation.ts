import type { z, ZodIssue, ZodType } from 'zod'

export enum ValidationStatus {
  NotValidated = 'NotValidated',
  Valid = 'Valid',
  Invalid = 'Invalid',
}

export type Validator<T, S> = (
  value: T,
  state: S,
) => {
  validationStatus: ValidationStatus
  errorMessage?: string
  requirementSatisfied: boolean
  maximumExceeded?: boolean
  minimumExceeded?: boolean
}

// zod не возвращает отдельной ошибки вроде requirement not satisfied
const isRequiredError = (error: ZodIssue) =>
  error.code === 'invalid_type' && error.received === 'undefined'

const isMaximumExceededError = (error: ZodIssue) => error.code === 'too_big'
const isMinimumExceededError = (error: ZodIssue) => error.code === 'too_small'

const getZodParseErrors = (schema: z.Schema, value: unknown) => {
  if (!schema) {
    return null
  }

  const parseResult = (schema as z.Schema).safeParse(value)

  if (parseResult.success) {
    return null
  }

  return (parseResult as z.SafeParseError<unknown>).error.errors
}

export const zodValidator =
  <T extends ZodType>(schema: T): Validator<z.infer<T>, unknown> =>
  value => {
    const isRequired = !schema.isOptional()
    // чтобы при пустой строке показало ошибку required вместо invalid
    const normalizedValue = value === '' ? undefined : value
    const requirementSatisfied =
      !isRequired || (normalizedValue !== undefined && normalizedValue !== null)

    const validationErrors = getZodParseErrors(schema, value)?.filter(
      err => !isRequiredError(err),
    )

    const firstError = validationErrors?.at(0)

    const validationStatus =
      requirementSatisfied &&
      (!validationErrors || validationErrors.length === 0)
        ? ValidationStatus.Valid
        : ValidationStatus.Invalid

    const maximumExceeded = validationErrors?.some(isMaximumExceededError)
    const minimumExceeded = validationErrors?.some(isMinimumExceededError)

    return {
      requirementSatisfied,
      validationStatus,
      errorMessage: firstError?.message,
      maximumExceeded,
      minimumExceeded,
    }
  }
