import {FaBook} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Ref} from "react";

interface Props {
    id: number
    title: string
    ref?: Ref<HTMLAnchorElement>
    books_count: number
}
export default function Category(props: Props) {
    const { title, ref, books_count } = props

    return (
        <Link
            ref={ref}
            to={`./${title.toLowerCase()}`}
            className={`flex gap-x-4 bg-white px-4 py-3 items-center text-lg hover:text-main_color_darker`}
        >
            <FaBook/>
            {title} {`(${books_count})`}
        </Link>
    )
}
