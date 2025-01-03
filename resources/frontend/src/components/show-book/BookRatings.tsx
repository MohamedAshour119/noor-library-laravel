import Rating from "./Rating.tsx";
import {Dispatch, SetStateAction} from "react";
import {ShowBookInterface} from "../../../Interfaces.ts";
import {CircularProgressbar} from "react-circular-progressbar";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
interface Props {
    book_id: number | undefined
    setBook_data: Dispatch<SetStateAction<ShowBookInterface | undefined>>
    book_data: ShowBookInterface | undefined
    handleOpenUnauthorizedMessage?: Dispatch<SetStateAction<boolean>>
}
export default function BookRatings(props: Props) {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const { book_id, setBook_data, book_data, handleOpenUnauthorizedMessage } = props
    let percentage = 0
    if (book_data?.average) percentage = (book_data?.average / 5) * 100;

    return (
        <div className={`flex flex-col gap-y-6 bg-white px-10 py-5 border rounded-lg`}>
            <h1 className={`font-roboto-semi-bold text-xl`}>{translation.book_ratings}</h1>

            <div className={`flex xs:flex-row flex-col justify-center gap-x-10 gap-y-10`}>
                <div className={`xs:w-1/2 w-full md:w-[60%] lg:w-1/2 flex flex-col items-center md:pe-5 lg:pe-0 pb-4 xs:pb-0 xs:border-e-2 border-b-2 xs:border-b-0 border-text_color/20`}>
                    <Rating
                        book_id={book_id}
                        setBook_data={setBook_data}
                        book_data={book_data}
                        handleOpenUnauthorizedMessage={handleOpenUnauthorizedMessage}
                    />
                </div>
                <div className={`sm:w-1/2 xs:w-[45%] w-full flex flex-col items-center gap-y-3`}>
                    <div>
                        <span className={`font-roboto-semi-bold text-lg`}>{translation.average_rating}: </span>
                        {book_data?.average}
                    </div>

                    {/* Circular Progress Bar */}
                    <div style={{ width: 100, height: 100, position: "relative" }}>
                        <CircularProgressbar
                            value={percentage}
                            text={`${Math.round(percentage)}%`}
                            styles={{
                                path: {
                                    stroke: "#ffd700",
                                    strokeWidth: 6,
                                },
                                text: {
                                    fill: "#ffd700",
                                    fontSize: "18px",
                                    dominantBaseline: "central",
                                    textAnchor: "middle",
                                    transformOrigin: "50% 50%",
                                },
                                trail: {
                                    stroke: "#e6e6e6",
                                },
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
