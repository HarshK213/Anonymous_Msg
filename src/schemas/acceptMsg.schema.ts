import { z } from 'zod'

export const acceptMsgValidation = z.object({
    acceptMsg: z.boolean(),
})