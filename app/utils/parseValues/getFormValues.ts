import { set } from "react-hook-form"
type FormValues = Record<string, string | string[]>

function parseData<T extends FormValues, U extends FormData | URLSearchParams>(
    data: U
): T {
    const result: Partial<T> = {}

    for (const [key, value] of data.entries()) {
        if (result.hasOwnProperty(key)) {
            if (Array.isArray(result[key])) {
                (result[key] as string[]).push(value as string)
            } else {
                (result[key] as string[]) = [result[key] as string, value as string]
            }
        } else {
            result[key] = value as string
        }
    }

    return result as T
}

export function getFormValues<T extends FormValues>(
    data: URLSearchParams | FormData
): T {
    const result = parseData(data)

    const values = {}

    Object.entries(result).forEach(([name, value]) => {
        set(values, name, value)
    })

    return values as T
}

export async function getFormData(request: Request) {
    const formData = await request.formData()

    return getFormValues(formData)
}

export function getSearchParams(request: Request) {
    const searchParams = new URL(request.url).searchParams

    return getFormValues(searchParams)
}
