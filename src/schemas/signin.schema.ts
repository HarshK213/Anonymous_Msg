import { z } from 'zod'

export const signinValidation = z.object({
    identifier: z.string(),              // Identifier as it can contain email or username
    password: z.string(),
})