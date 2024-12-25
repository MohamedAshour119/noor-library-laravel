import ReactStars from "react-stars";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import apiClient from "../../../ApiClient.ts";
import {ShowBookInterface} from "../../../Interfaces.ts";
import {get_book_language_label} from "../../Utilities/getBookLanguageLabel.ts";
import {CiStar} from "react-icons/ci";

interface Props {
    book_id: number | undefined
    setBook_data: Dispatch<SetStateAction<ShowBookInterface | undefined>>
    book_data: ShowBookInterface | undefined
}
export default function Rating(props: Props) {
    const { book_id, setBook_data, book_data } = props
    const [rating, setRating] = useState<number>(book_data?.your_rate ?? 0);
    useEffect(() => {
        if (book_data?.your_rate) setRating(book_data?.your_rate)
    }, [book_data]);

    const handleRatingChange = (new_rating: number) => {
        setRating(new_rating);
        apiClient().post(`/books/rating/${book_id}`, { rating: new_rating })
            .then(res => {
                const book_language_label = get_book_language_label(res.data.data.book.language)
                const book = res.data.data.book
                book.language = book_language_label
                setBook_data(book)
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            <h1 className={`font-roboto-semi-bold text-lg`}>Rate this book:</h1>
            <div className={`flex items-center gap-x-3`}>
                <ReactStars
                    count={5}
                    value={rating}
                    onChange={handleRatingChange}
                    size={35}
                    color1={`#d9d9d9`}
                    color2={`#ffe34b`}
                    className={`-ml-1`}
                />
                <span className={`text-lg`}>({book_data?.ratings_count})</span>
            </div>
        </>
    )
}
