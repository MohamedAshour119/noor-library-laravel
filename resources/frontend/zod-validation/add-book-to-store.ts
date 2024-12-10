import {z} from "zod";

const formSchema = z.object({
    book_title: z
        .string()
        .min(1, { message: 'Email is required.' })
        .min(3, { message: 'Title must be at least 3 characters.'})
        .max(64, { message: 'Title must not exceed 64 characters.'}),
    book_description: z
        .string()
        .min(1, { message: 'Description is required'})
        .min(50, { message: 'Description must be at least 50 characters.' })
        .max(2000, { message: 'Description must not exceed 2000 characters.' }),
    is_author: z
        .boolean({ message: 'You must select whether you are the author or not.' }),
    book_language: z
        .string({ message: 'Language is required.'}),
    author: z
        .string()
        .min(1, { message: 'Author name is required'})
        .max(80, { message: 'Author must not exceed 50 characters.'}),
    category: z
        .string({ message: 'Category is required.'}),
    downloadable: z
        .coerce.boolean(),
    cover: z
        .instanceof(File, {
            message: 'Book cover required'
        }) // Ensures the value is a File object
        .refine(image => image.size <= 5 * 1024 * 1024, { // Validate max image size (5MB in this case)
            message: 'Image size must be less than 5MB.',
        })
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type), { // Validate file type
            message: 'Image must be a (jpeg, png, jpg or webp).',
        }),
    book_file: z
        .instanceof(File, {
            message: 'Book file required'
        })
        .refine(file => file.size <= 80 * 1024 * 1024, {
            message: 'Book size must be less than 80MB',
        })
        .refine(file => file.type === 'application/pdf', {
            message: 'Book must be PDF format'
        })
});


export {formSchema as add_book_to_store_validation}