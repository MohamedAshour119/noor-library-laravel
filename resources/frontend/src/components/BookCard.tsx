import { Link } from "react-router-dom";
import {Ref} from "react";
import ReactStars from "react-stars";
import {MdAddShoppingCart} from "react-icons/md";
import {IoIosHeartEmpty} from "react-icons/io";

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
    const {average_ratings, title, slug, author, cover, ref, styles, price, ratings_count, is_free } = props

    return (
        <Link
            ref={ref}
            to={`/books/${slug}`}
            className={`${styles ? styles : ''} group relative flex flex-col justify-self-center gap-y-2 md:w-full w-fit items-center border bg-white p-5 rounded-lg hover:border-main_color transition`}
        >
            <div className={`absolute z-10 bg-main_color_darker/60 w-0 group-hover:w-[60px] transition-all duration-200 left-0 top-0 h-full flex justify-center items-center flex-col gap-y-4 rounded-bl-lg rounded-tl-lg`}>
                <button
                    className={`bg-white p-3 rounded-full w-fit invisible group-hover:visible transition-all duration-75 text-main_color hover:bg-main_color hover:text-white`}
                >
                    <MdAddShoppingCart className={`size-5`}/>
                </button>
                <button
                    className={`bg-white p-3 rounded-full w-fit invisible group-hover:visible transition-all duration-75 text-red-600 hover:bg-main_color hover:text-white`}
                >
                    <IoIosHeartEmpty className={`size-5`}/>
                </button>
            </div>
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
            <div className={`border border-main_color bg-main_color p-1 px-10 ${is_free ? '!bg-main_bg !border-border_color !text-text_color' : ''} size-10 flex items-center justify-center text-white rounded-full`}>
                {!is_free ? price + '$' : 'Free'}
            </div>
        </Link>
    );
}
