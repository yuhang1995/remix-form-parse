import type { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import { getFormData, getSearchParams } from "./getFormValues"

interface SchemaProperty {
    type: string
    properties?: Record<string, SchemaProperty>
    items?: SchemaProperty
}

interface ObjectSchema {
    type: "object"
    properties: Record<string, SchemaProperty>
}

interface ArraySchema {
    type: "array"
    items: SchemaProperty
}

type Schema = ObjectSchema | ArraySchema | SchemaProperty

function formatJSONData<T>(jsonData: any, schema: Schema): T {
    let formattedData:
        | Record<string, any>
        | Array<any>
        | string
        | number
        | boolean
        | null

    if (schema.type === "object") {
        formattedData = {}
        for (const key in schema.properties) {
            if (jsonData.hasOwnProperty(key)) {
                let value = jsonData[key]
                const propertySchema = schema.properties[key]

                if (propertySchema.type === "object") {
                    formattedData[key] = formatJSONData(value, propertySchema)
                } else if (propertySchema.type === "array") {
                    value = [].concat(value)
                    formattedData[key] = value.map((item: any) =>
                        formatJSONData(
                            item,
                            propertySchema.items || propertySchema
                        )
                    )
                } else {
                    formattedData[key] = convertValue(
                        value,
                        propertySchema.type
                    )
                }
            }
        }
    } else if (schema.type === "array") {
        formattedData = Array.isArray(jsonData)
            ? jsonData.map((item) =>
                  formatJSONData(item, schema.items || schema)
              )
            : []
    } else {
        formattedData = convertValue(jsonData, schema.type)
    }

    return formattedData as T
}

function convertValue(value: string, type: string) {
    switch (type) {
        case "string":
            return String(value)
        case "integer":
            return parseInt(value)
        case "number":
            return Number(value)
        case "boolean":
            const coerceFlase = ["false"]
            if (coerceFlase.includes(value)) return false
            return Boolean(value)
        case "null":
            return null
        case "date-time":
            return new Date(value).toISOString()
        default:
            return value
    }
}

export function parseValues<
    T extends Record<string, string | string[]>,
    S extends z.ZodTypeAny
>(values: T, schema: S): z.infer<typeof schema> {
    const jsonSchema = zodToJsonSchema(schema)

    return formatJSONData<z.infer<typeof schema>>(values, jsonSchema)
}

export async function parseFormData<S extends z.ZodTypeAny>(
    request: Request,
    schema: S
): Promise<z.infer<typeof schema>> {
    const formDataValues = await getFormData(request)

    return parseValues(formDataValues, schema)
}

export function parseSearchParams<S extends z.ZodTypeAny>(
    request: Request,
    schema: S
): z.infer<typeof schema> {
    const searchParams = getSearchParams(request)

    return parseValues(searchParams, schema)
}
