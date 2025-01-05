import ReactStars from "react-stars";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import apiClient from "../../../ApiClient.ts";
import {ShowBookInterface} from "../../../Interfaces.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {enqueueSnackbar} from "notistack";
import {useBookLanguageLabel} from "../../hooks/UseBookLanguageLabel.ts";

interface Props {
    book_id: number | undefined
    setBook_data: Dispatch<SetStateAction<ShowBookInterface | undefined>>
    book_data: ShowBookInterface | undefined
    handleOpenUnauthorizedMessage?: Dispatch<SetStateAction<boolean>>
}
export default function Rating(props: Props) {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const { book_id, setBook_data, book_data, handleOpenUnauthorizedMessage } = props
    const auth_user = useSelector((state: RootState) => state.user)
    const [rating, setRating] = useState<number>(book_data?.your_rate ?? 0);
    useEffect(() => {
        if (book_data?.your_rate) setRating(book_data?.your_rate)
    }, [book_data]);

    const handleRatingChange = (new_rating: number) => {
        if (auth_user.is_vendor) {
            if (handleOpenUnauthorizedMessage) {
                handleOpenUnauthorizedMessage(true)
            }
        } else {
            if (!auth_user.id) {
                enqueueSnackbar('You must sign in to rate.', { variant: "error" });
            } else {
                setRating(new_rating);
                apiClient().post(`/books/rating/${book_id}`, { rating: new_rating })
                    .then(res => {
                        const book_language_label = useBookLanguageLabel(res.data.data.book.language);
                        const book = res.data.data.book;
                        book.language = book_language_label;
                        setBook_data(book);
                    })
                    .catch(err => console.error(err));
            }
        }
    };


    return (
        <>
            <h1 className={`font-roboto-semi-bold text-lg`}>{translation.rate_this_book}:</h1>
            <div className={`flex items-center gap-x-3`}>
                <div className={`flex items-center relative`}>
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={handleRatingChange}
                        size={35}
                        color1={`#d9d9d9`}
                        color2={`#FFC64BFF`}
                        className={`-ml-1`}
                        edit={!!auth_user.id}
                    />
                    {!auth_user.id &&
                        <button
                            className={`absolute w-full z-10 h-full`}
                            onClick={() => enqueueSnackbar('You must sign in to rate.', {variant: "error"})}
                        ></button>
                    }
                </div>
                <span className={`text-lg`}>({book_data?.ratings_count})</span>
            </div>
        </>
    )
}
