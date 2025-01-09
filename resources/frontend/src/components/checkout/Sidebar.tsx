import {Book} from "../../../Interfaces.ts";

interface Props {
    cart_books: Book[]
    total_price: number
}
export default function Sidebar({cart_books, total_price}: Props) {

    const show_books = cart_books.map(book => (
        <div className={`flex gap-x-1`}>
            <h1>{book.title}:</h1>
            <span>{book.quantity}</span>
        </div>
    ))

    return (
        <div className="bg-white p-4 rounded-lg mt-20 shadow-[0px_0px_12px_-5px]">
            <h2 className="text-lg font-semibold mb-4">Your order</h2>

            <div className="mb-2">
                {show_books}
            </div>

            <div className={`font-semibold`}>{`Total: `}{total_price}</div>

            <button className="bg-main_color hover:bg-main_color_darker text-white font-bold py-2 px-4 rounded">
                Place order
            </button>
        </div>
    )
}
