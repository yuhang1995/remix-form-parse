import type { z } from "zod"

import { getFormData, getSearchParams } from "./getFormValues"

type FormSchema<T extends z.ZodTypeAny = z.SomeZodObject | z.ZodEffects<any>> =
    | z.ZodEffects<T>
    | z.SomeZodObject

export function parseValues<T, S extends FormSchema>(
    values: T,
    schema: S
): z.infer<typeof schema> {
    const result = schema.safeParse(values)

    console.log("values", values)
    console.log("result", result)

    if (result.success) {
        return result.data
    }

    return values
}

export async function parseFormData<Schema extends FormSchema>(
    request: Request,
    schema: Schema
) {
    const formDataValues = await getFormData(request)

    return parseValues(formDataValues, schema)
}

export function parseSearchParams<Schema extends FormSchema>(
    request: Request,
    schema: Schema
) {
    const searchParams = getSearchParams(request)

    return parseValues(searchParams, schema)
}
