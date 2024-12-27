import { Link } from "react-router-dom";
import {Ref} from "react";
import ReactStars from "react-stars";

interface Props {
    average_ratings?: number;
    id?: number,
    title?: string
    slug?: string
    description?: string
    is_author?: boolean
    is_free?: boolean
    price: number
    author?: string
    language?: string
    cover?: string
    book_file?: string
    downloadable?: boolean
    ref?: Ref<HTMLAnchorElement>
    styles?: string
    ratings_count: number
}

export default function BookCard(props: Props) {
    const {average_ratings, title, slug, author, cover, ref, styles, price, ratings_count } = props

    return (
        <Link
            ref={ref}
            to={`/books/${slug}`}
            className={`${styles ? styles : ''} relative flex flex-col justify-self-center gap-y-2 md:w-full w-fit items-center border bg-white p-5 rounded-lg hover:border-main_color transition hover:-translate-y-1`}
        >
            <div className={`flex items-center gap-x-3`}>
                <div className={`flex items-center relative`}>
                    <ReactStars
                        count={5}
                        value={average_ratings}
                        size={25}
                        color1={`#d9d9d9`}
                        color2={`#ffc64b`}
                        className={`-ml-1 custom-stars`}
                        edit={false}
                    />
                </div>
                <span className={`text-lg`}>({ratings_count})</span>
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
            <div className={`border border-main_color bg-main_color p-1 px-10 ${price === 0 ? '!bg-main_bg !border-border_color !text-text_color' : ''} size-10 flex items-center justify-center text-white rounded-full`}>
                {price > 0 ? price + '$' : 'Free'}
            </div>
        </Link>
    );
}
