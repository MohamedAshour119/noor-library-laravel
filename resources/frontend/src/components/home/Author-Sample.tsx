import {FaBook} from "react-icons/fa";
import {Link} from "react-router-dom";

export default function AuthorSample() {
    return (
        <Link
            to={`#`}
            className={`flex items-center justify-between text-xl font-normal hover:underline underline-offset-4`}
        >
            <span>Author Name</span>
            <FaBook className={`text-main_color`}/>
        </Link>
    )
}
