import {FaBook} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Ref} from "react";
interface Props {
    name: string
    ref?: Ref<HTMLAnchorElement>
}
export default function CategorySample(props: Props) {
    const { name, ref } = props


    return (
        <Link
            to={`/categories/${name.toLowerCase()}`}
            ref={ref}
            className={`flex items-center justify-between text-xl font-normal hover:underline underline-offset-4`}
        >
            <span>{name}</span>
            <FaBook className={`text-main_color`}/>
        </Link>
    )
}
