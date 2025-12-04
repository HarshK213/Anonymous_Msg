import { z } from 'zod'

export const verifyValidation = z.object({
    code: z.string().min(6, "Verification code must be of 6 digits");
});