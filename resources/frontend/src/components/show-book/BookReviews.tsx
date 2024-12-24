import Rating from "./Rating.tsx";
interface Props {
    book_id: number | undefined
}
export default function BookReviews({book_id}: Props) {
    return (
        <div className={`flex flex-col gap-y-6 bg-white px-10 py-5 border rounded-lg`}>
            <h1 className={`font-roboto-semi-bold text-lg`}>Book Reviews</h1>

            <div className={`flex gap-x-10`}>
                <div className={`w-1/4 flex flex-col border-e-2 border-text_color/20`}>
                    <Rating book_id={book_id}/>
                </div>
                <div className={`w-1/4 flex flex-col`}>
                    <div className={``}>Average Rating: 20000</div>
                </div>
            </div>
        </div>
    )
}
