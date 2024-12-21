import {Link} from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import CategorySample from "./home/Category-Sample.tsx";

export default function CategorySidebar() {
    return (
        <div className={`flex flex-col gap-y-4 h-fit bg-white rounded p-4 border`}>
            <div className={`flex items-center justify-between border-b pb-2 border-main_color`}>
                <Link
                    to={`#`}
                    className={`hover:underline underline-offset-4`}
                >
                    <span className={`font-roboto-semi-bold text-xl`}>Categories</span>
                </Link>
                <FaSearch className={`size-5 cursor-pointer`}/>
            </div>

            <div className={`flex flex-col gap-y-4`}>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
                <CategorySample/>
            </div>
        </div>
    )
}
