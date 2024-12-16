export interface User {
    id: number | null
    username: string | null
    email: string | null
    createdAt: string | null
    updatedAt: string | null
    is_vendor?: boolean | null
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
    book_title?: string | null
    book_description?: string | null
    is_author?: string | null
    is_free?: string | null
    price?: string | null
    book_language?: string | null
    author?: string | null
    category?: string | null
    cover?: string | null
    book_file?: string | null
}

export const AddBookErrorsDefaultValues = {
    book_title: null,
    book_description: null,
    is_author: null,
    is_free: null,
    price: null,
    book_language: null,
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
// export const BookDefaultValues = {
//     id: 0,
//     title: '',
//     description: '',
//     is_author: false,
//     author: '',
//     language: '',
//     category: '',
//     cover_url: '',
//     file_url: '',
//     user_id: 0,
//     downloadable: false
// }

export interface CategoryInterface {
    id: number
    name: string
}
