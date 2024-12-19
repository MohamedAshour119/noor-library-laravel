export interface User {
    id: number | null
    username: string | null
    first_name: string
    last_name: string
    email: string
    createdAt: string | null
    updatedAt: string | null
    is_vendor?: boolean | null
    phone?: string | null
    avatar?: string
}

type BinaryOptionsInterface = {
    value: boolean
    label: string
    type: string
}
type OtherBookOptions = {
    value: string
    label: string
    type: string
}

export interface AddBookInterface {
    book_title: string
    book_description: string
    is_author: BinaryOptionsInterface | null
    is_free: BinaryOptionsInterface | null
    price: number | null
    book_language: OtherBookOptions | null
    author: string
    category: OtherBookOptions | null
    cover: string | File | null
    downloadable: boolean
    book_file: string | File | null
}

export const AddBookDefaultValues = {
    book_title: '',
    book_description: '',
    is_author: null,
    is_free: null,
    price: null,
    book_language: null,
    author: '',
    category: null,
    cover: null,
    downloadable: false,
    book_file: null
}

export interface AddBookErrors {
    title?: string | null
    description?: string | null
    is_author?: string | null
    is_free?: string | null
    price?: string | null
    language?: string | null
    author?: string | null
    category?: string | null
    cover?: string | null
    book_file?: string | null
}

export const AddBookErrorsDefaultValues = {
    title: null,
    description: null,
    is_author: null,
    is_free: null,
    price: null,
    language: null,
    author: null,
    category: null,
    cover: null,
    book_file: null,
}

export interface Book {
    id: number,
    title: string
    description: string
    is_author: boolean
    is_free: boolean
    price: number
    author: string
    language: string
    category: string
    cover: string
    book_file?: string
    downloadable: boolean
}

export interface CategoryInterface {
    id: number
    name: string
}

export interface SignUpForm {
    username?: string
    first_name?: string
    last_name?: string
    phone_number?: string | null
    country_code?: string
    email?: string
    password?: string
    password_confirmation?: string
    google_recaptcha?: string | null
    is_vendor?: boolean
}

export interface Errors {
    username?: string
    first_name?: string
    last_name?: string
    phone_number?: string
    country_code?: string
    email?: string
    password?: string
    password_confirmation?: string
    recaptcha?: string

}
