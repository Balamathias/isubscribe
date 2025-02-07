import { z } from "zod";

export const UserSchema = z.object({
    username: z.string(),
    email: z.string().email().readonly(),
    phone: z.string().min(11).max(11),
    first_name: z.string(),
    last_name: z.string(),
    pin: z.string().min(4).max(4),
    invited_by: z.string().min(10, {message: "Invalid invite code"}).max(10, {message: 'Invalid invite code.'}).optional(),
    postal_code: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    street: z.string().nullable().optional(),
})

export const AuthSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email address.'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long.'}),
    confirm_password: z.string().min(6, {message: 'Password must be at least 6 characters long.'}).optional(),
})

export const SignUpSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email address.'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long.'}),
    confirm_password: z.string().min(6, {message: 'Password must be at least 6 characters long.'}).optional(),
    full_name: z.string({message: "Your full Name is required."}).optional(),
    phone: z.string({message: "Your phone number is required"}).min(11, {message: "Make sure your phone number is exactly 11 characters"}).max(11, {message: "Make sure your phone number is exactly 11 characters"}).optional()
})
