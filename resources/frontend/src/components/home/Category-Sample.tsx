import {FaBook} from "react-icons/fa";
import {Link} from "react-router-dom";
interface Props {
    name: string
    slug: string
}
export default function CategorySample(props: Props) {
    const { name, slug } = props
    return (
        <Link
            to={`/categories/${slug}`}
            className={`flex items-center justify-between text-xl font-normal hover:underline underline-offset-4`}
        >
            <span>{name}</span>
            <FaBook className={`text-main_color dark:text-dark_text_color`}/>
        </Link>
    )
}
