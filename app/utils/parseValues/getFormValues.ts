import { set } from "react-hook-form"
import qs from "qs"

function formDataToURlSearchParams(formData: FormData) {
    return new URLSearchParams(formData as any)
}

export function getFormValues(data: URLSearchParams | FormData) {
    // const result = Object.fromEntries(data)
    const searchParamsStr =
        data instanceof URLSearchParams
            ? data.toString()
            : formDataToURlSearchParams(data).toString()

    const result = qs.parse(searchParamsStr)

    const values = {}

    Object.entries(result).forEach(([name, value]) => {
        set(values, name, value)
    })

    return values
}

export async function getFormData(request: Request) {
    const formData = await request.formData()

    return getFormValues(formData)
}

export function getSearchParams(request: Request) {
    const searchParams = new URL(request.url).searchParams

    return getFormValues(searchParams)
}
