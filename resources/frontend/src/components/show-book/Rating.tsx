import ReactStars from "react-stars";
import {useState} from "react";
import apiClient from "../../../ApiClient.ts";

interface Props {
    book_id: number | undefined
}
export default function Rating({book_id}: Props) {
    const [rating, setRating] = useState(0);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        apiClient().post('/ratings', { book_id: book_id, rating: newRating })
            .then(response => console.log(response.data.message))
            .catch(err => console.error(err));
    };

    return (
        <>
            <h1>Rate this book:</h1>
            <ReactStars
                count={5}
                value={rating}
                onChange={handleRatingChange}
                size={35}
                color1={`#d9d9d9`}
                color2={`#ffe34b`}
                className={`-ml-1`}
            />
        </>
    )
}
