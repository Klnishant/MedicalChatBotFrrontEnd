import { z } from 'zod'

export const usernameValidation = z
.string()
.min(2,'username must be atleast 2 characters')
.max(20,'username must be no longer than 20 characters')
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
    password: z
            .string()
            .min(8,'assword must be atleast 6 characters')
            .max(20,'Password must be no longer than 20 characters')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=+{}[\]|:;"'<>,.?/~`]).{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
});