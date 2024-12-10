import {z} from "zod";

const formSchema = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email format.' })
        .min(1, { message: 'Email is required.' }),
    password: z
        .string()
        .min(1, {message: 'Password is required'})
        .max(64, { message: 'Password must not exceed 64 characters.' }),
});

export {formSchema as sign_in_validation}