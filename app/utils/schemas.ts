import { z } from "zod"

/**
 * 使用zod的schema去解析boolean字符串，例如"false" "true" "on" 等
 *
 * @example
 * ```ts
 * BoolAsString.parse('true') -> true
 * BoolAsString.parse('on') -> true
 * BoolAsString.parse('false') -> false
 * ```
 */
export const BoolAsString = z.string().transform((val) => {
    const coerceFlase = ["false"]
    if (coerceFlase.includes(val)) return false
    return Boolean(val)
})
