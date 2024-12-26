import {FaBook} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Ref} from "react";
interface Props {
    name: string
}
export default function CategorySample(props: Props) {
    const { name } = props


    return (
        <Link
            to={`/categories/${name.toLowerCase()}`}
            className={`flex items-center justify-between text-xl font-normal hover:underline underline-offset-4`}
        >
            <span>{name}</span>
            <FaBook className={`text-main_color`}/>
        </Link>
    )
}
