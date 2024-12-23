import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import {Ref} from "react";

interface Props {
    rate?: number;
    id?: number,
    title?: string
    slug?: string
    description?: string
    is_author?: boolean
    is_free?: boolean
    price?: number
    author?: string
    language?: string
    cover?: string
    book_file?: string
    downloadable?: boolean
    ref?: Ref<HTMLAnchorElement>
    styles?: string
}

export default function BookCard(props: Props) {
    const {rate, title, slug, author, cover, ref, styles } = props

    return (
        <Link
            ref={ref}
            to={`/books/${slug}`}
            className={`${styles ? styles : ''} relative flex flex-col justify-self-center gap-y-2 md:w-full w-fit items-center border bg-white p-5 rounded-lg hover:border-main_color transition hover:-translate-y-1`}
        >
            <div className="flex items-center gap-x-2">
                <div className="flex text-[#E0E0E0]">
                    <FaStar />
                    <FaStar className="-ml-[2px]" />
                    <FaStar className="-ml-[2px]" />
                    <FaStar className="-ml-[2px]" />
                    <FaStar className="-ml-[2px]" />
                </div>
                <span>({rate || 0})</span>
            </div>
            <img src={cover} alt="ShowBook-img" className="rounded border p-1" />
            <Link
                to="#"
                className="font-roboto-semi-bold text-lg hover:underline underline-offset-2"
            >
                {title}
            </Link>
            <Link
                to="#"
                className="text-main_color font-medium hover:underline underline-offset-2"
            >
                {author}
            </Link>
            {/* Price */}
            <div className={`border border-main_color bg-main_color p-1 size-10 flex items-center justify-center text-white rounded-full`}>
                20$
            </div>
            {/* Price */}
        </Link>
    );
}
