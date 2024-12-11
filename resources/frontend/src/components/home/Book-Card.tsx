import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
    rate?: number;
    cover: string;
    title: string;
    author: string;
}

export default function BookCard(props: Props) {
    const {rate, cover, title, author } = props

    return (
        <Link
            to={`#`}
            className="flex flex-col justify-self-center gap-y-2 min-[400px]:w-full w-fit items-center border bg-white p-5 rounded-lg hover:border-main_color transition hover:-translate-y-1 "
        >
            <div className="flex items-center gap-x-2">
                <div className="flex text-[#E0E0E0]">
                    <FaStar />
                    <FaStar className="-ml-[2px]" />
                    <FaStar className="-ml-[2px]" />
                    <FaStar className="-ml-[2px]" />
                    <FaStar className="-ml-[2px]" />
                </div>
                <span>({rate || 0})</span>
            </div>
            <Link to="#">
                <img src={cover} alt="Book-img" className="rounded border p-1" />
            </Link>
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
        </Link>
    );
}
