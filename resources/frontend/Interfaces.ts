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
    wishlists_count?: number
    country_code: undefined | null | string,
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
    id: number
    title: string
    slug: string
    description: string
    category?: string
    is_author: boolean
    is_free: boolean
    price: number
    author: string
    language: string
    size: string
    comments_count: number
    ratings: number
    ratings_count: number
    average: number
    your_rate: number
    pages_count: number
    cover: string
    book_file?: string
    downloadable: boolean
    created_at: string
    is_added_to_wishlist: boolean
    quantity?: number
}

export interface BookCardInterface {
    id: number
    title: string
    slug: string
    author: string
    price: number
    is_free: boolean
    cover: string
    average_ratings: number
    ratings_count: number
    vendor: {
        first_name: string
        last_name: string
        username: string
    }
}

export interface CategoryInterface {
    id: number
    name: string
    slug: string
    books_count: number
    created_at?: string
    updated_at?: string
}

export interface SignUpForm {
    username?: string
    first_name?: string
    last_name?: string
    phone_number?: string | null
    country_code?: string | undefined | null
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
    google_recaptcha?: string
}

export interface ShowBookInterface extends Book {
    vendor: User
    category: string
    comments: CommentInterface[]
}

export interface CommentInterface {
    id: number
    user: {
        first_name: string
        last_name: string
        username: string
        avatar: string
    }
    rating: number
    body: string
    created_at: string
    book?: {
        id: number
        slug: string
        title: string
    }
}

export interface SearchBooks {
    slug: string
    title: string
}

export interface BillingInfo {
    first_name: string
    last_name: string
    city: string
    street: string
    phone_number: string
    amount: number
    cash_on_delivery: boolean
    pay_with_credit_card: boolean
}
