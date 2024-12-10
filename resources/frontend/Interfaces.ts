export interface User {
    id: number | null
    username: string | null
    email: string | null
    createdAt: string | null
    updatedAt: string | null
}

type IsAuthorOption = {
    value: boolean
    label: string
    type: string
}
type OtherBookOptions = {
    value: string
    label: string
    type: string
}

export interface AddBook {
    book_title: string
    book_description: string
    is_author: IsAuthorOption | null
    book_language: OtherBookOptions | null
    author: string
    category: OtherBookOptions | null
    cover: string | File | null
    downloadable: boolean
    book_file: File | null
}

export const AddBookDefaultValues = {
    book_title: '',
    book_description: '',
    is_author: null,
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
    is_author?: boolean | null
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
    author: string
    language: string
    category: string
    cover_url: string
    file_url?: string
    user_id: number
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