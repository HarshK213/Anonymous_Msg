// this schema is for validation of what user will send while signup process.
// mongoose also perform validation , but mongoose perfom validation of whole user
// but this schema will perform validation only while signup

import { z } from "zod";

// here we dont use z.object because here we are only validating only one field
const usernameValidation = z
  .string()
  .min(2, "Username should atleast have 2 characters")
  .max(20, "Username should be no more than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username should not contain any special character",
  );

// here we use z.object as we are validating multiple field at once
const signupValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid E-mail address" }),
  password: z
    .string()
    .min(6, { message: "password should be atleast of 6 charcters" }),
});

export { usernameValidation, signupValidation };
