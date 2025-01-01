import {FaBook} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Ref} from "react";

interface Props {
    id: number
    name: string
    slug: string
    ref?: Ref<HTMLAnchorElement>
    books_count: number
}
export default function Category(props: Props) {
    const { name, slug, ref, books_count } = props
    console.log(slug)
    return (
        <Link
            ref={ref}
            to={`./${slug}`}
            className={`flex gap-x-4 bg-white px-4 py-3 items-center text-lg hover:text-main_color_darker`}
        >
            <FaBook/>
            {name} {`(${books_count})`}
        </Link>
    )
}
