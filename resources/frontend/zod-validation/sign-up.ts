import {z} from "zod";

const formSchema = z.object({
    username: z
        .string()
        .min(1, { message: 'Username is required.' })
        .min(3, {message: 'Username must be at least 3 characters'})
        .max(16, { message: 'Username exceeded 16 characters.' }),
    email: z
        .string()
        .email({ message: 'Invalid email format.' })
        .min(1, { message: 'Email is required.' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .max(64, { message: 'Password must not exceed 64 characters.' }),
    password_confirmation: z
        .string()
        .min(1, { message: 'Password confirmation is required.' })
})   .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must be matched",
    path: ["password_confirmation"],
});

export {formSchema as sign_up_validation}