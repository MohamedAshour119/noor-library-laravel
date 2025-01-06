import {CommentInterface} from "../../../Interfaces.ts";
import {Dispatch, SetStateAction} from "react";

interface Props {
    reviews: CommentInterface[]
    set_reviews: Dispatch<SetStateAction<CommentInterface[]>>
}
export default function Reviews(props: Props) {
    const {reviews, set_reviews} = props



    return (
        <div>

        </div>
    )
}
