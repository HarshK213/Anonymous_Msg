import { z } from 'zod'
import { usernameValidation } from './signup.schema'

export const signinValidation = z.object({
    Identifier: z.string,              // Identifier as it can contain email or username
    password: z.string(),
})