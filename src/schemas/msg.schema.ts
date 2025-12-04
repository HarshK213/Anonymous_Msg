import { z } from 'zod'

export const msgValidation = z.object({
    content: z.string().max(400, { message: "Content must be no longer that 400 words" })
})