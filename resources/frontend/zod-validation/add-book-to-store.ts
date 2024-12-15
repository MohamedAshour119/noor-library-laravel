import { z } from "zod";

const formSchema = z.object({
    book_title: z
        .string()
        .min(1, { message: 'Title is required.' })
        .min(3, { message: 'Title must be at least 3 characters.' })
        .max(64, { message: 'Title must not exceed 64 characters.' }),
    book_description: z
        .string()
        .min(1, { message: 'Description is required.' })
        .min(50, { message: 'Description must be at least 50 characters.' })
        .max(2000, { message: 'Description must not exceed 2000 characters.' }),
    is_author: z.boolean({ message: 'You must select whether you are the author or not.' }),
    is_free: z.boolean({ message: 'You must select whether the book is free or not.' }),
    price: z.number({ message: 'Price must be a valid number.' }),
    book_language: z.string({ message: 'Language is required.' }),
    author: z
        .string()
        .min(1, { message: 'Author name is required.' })
        .max(80, { message: 'Author must not exceed 80 characters.' }),
    category: z.string({ message: 'Category is required.' }),
    downloadable: z.coerce.boolean(),
    cover: z
        .instanceof(File, { message: 'Book cover is required.' })
        .refine(image => image.size <= 5 * 1024 * 1024, { message: 'Image size must be less than 5MB.' })
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type), {
            message: 'Image must be (jpeg, png, jpg, or webp).',
        }),
    book_file: z
        .instanceof(File, { message: 'Book file is required.' })
        .refine(file => file.size <= 80 * 1024 * 1024, { message: 'Book size must be less than 80MB.' })
        .refine(file => file.type === 'application/pdf', { message: 'Book must be in PDF format.' }),
})

export { formSchema as add_book_to_store_validation };
