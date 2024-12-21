import {Link} from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import AuthorSample from "./home/Author-Sample.tsx";

export default function AuthorsSidebar() {
    return (
        <div className={`flex flex-col gap-y-4 h-fit bg-white rounded p-4`}>
            <div className={`flex items-center justify-between border-b pb-2 border-main_color`}>
                <Link
                    to={`#`}
                    className={`hover:underline underline-offset-4`}
                >
                    Authors
                </Link>
                <FaSearch className={`size-5 cursor-pointer`}/>
            </div>

            <div className={`flex flex-col gap-y-4`}>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
                <AuthorSample/>
            </div>
        </div>
    )
}
