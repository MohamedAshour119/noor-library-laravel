import {Link} from "react-router-dom";

interface Props {
    src: string
    content: string
    is_book_section_active?: boolean
    is_review_section_active?: boolean
    is_purchased_books_active?: boolean
}

export default function NotFoundContainer({src, content, is_book_section_active = true, is_purchased_books_active = false}: Props) {
    return (
        <div className={`flex flex-col items-center gap-y-4 bg-white w-full p-10 border border-border_color rounded text-xl`}>
            <img
                src={src}
                alt={`not-found`}
                width={100}
            />
            <div className={`flex gap-x-2`}>
                <span>
                    {`${content} `}
                    {is_book_section_active &&
                        <Link
                            to={`/add-book-to-store`}
                            className={`text-main_color_darker`}
                        >
                            Upload Book
                        </Link>
                    }
                    {is_purchased_books_active &&
                        <Link
                            to={`/`}
                            className={`text-main_color_darker`}
                        >
                            Explore Books
                        </Link>
                    }
                </span>
            </div>
        </div>
    )
}
