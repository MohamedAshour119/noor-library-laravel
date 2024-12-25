import Rating from "./Rating.tsx";
import {Dispatch, SetStateAction} from "react";
import {ShowBookInterface} from "../../../Interfaces.ts";
import {CircularProgressbar} from "react-circular-progressbar";
interface Props {
    book_id: number | undefined
    setBook_data: Dispatch<SetStateAction<ShowBookInterface | undefined>>
    book_data: ShowBookInterface | undefined
}
export default function BookRatings(props: Props) {
    const { book_id, setBook_data, book_data } = props
    let percentage = 0
    if (book_data?.average) percentage = (book_data?.average / 5) * 100;

    return (
        <div className={`flex flex-col gap-y-6 bg-white px-10 py-5 border rounded-lg`}>
            <h1 className={`font-roboto-semi-bold text-xl`}>Book Reviews</h1>

            <div className={`flex xs:flex-row flex-col gap-x-10 gap-y-10`}>
                <div className={`xl:w-1/4 xs:w-1/2 w-full flex flex-col xs:pe-4 pb-4 xs:pb-0 xs:border-e-2 border-b-2 xs:border-b-0 border-text_color/20`}>
                    <Rating
                        book_id={book_id}
                        setBook_data={setBook_data}
                        book_data={book_data}
                    />
                </div>
                <div className={`xl:w-1/4 sm:w-1/3 xs:w-[45%] w-full flex flex-col gap-y-3`}>
                    <div>
                        <span className={`font-roboto-semi-bold text-lg`}>Average Rating: </span>
                        {book_data?.average}
                    </div>

                    {/* Circular Progress Bar */}
                    <div style={{ width: 100, height: 100 }} className="mb-4">
                        <CircularProgressbar
                            value={percentage}
                            text={`${Math.round(percentage)}%`}
                            styles={{
                                path: { stroke: "#ffd700", strokeWidth: 6 },
                                text: { fill: "#ffd700", fontSize: 18 },
                                trail: { stroke: "#e6e6e6" },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
