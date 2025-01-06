import {CommentInterface} from "../../../Interfaces.ts";
import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import apiClient from "../../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import Comment from "../show-book/Comment.tsx";

interface Props {
    reviews: CommentInterface[]
    setReviews: Dispatch<SetStateAction<CommentInterface[]>>
    next_page_url: string
    setNext_page_url: Dispatch<SetStateAction<string>>
    is_loading: boolean
    setIs_loading: Dispatch<SetStateAction<boolean>>
    is_fetching: boolean
    setIs_fetching: Dispatch<SetStateAction<boolean>>
}
export default function Reviews(props: Props) {
    const {reviews, setReviews, is_loading, setIs_loading, is_fetching, setIs_fetching, next_page_url, setNext_page_url} = props

    const getReviews = (page_url: string, fetch_at_start = true) => {
        if (fetch_at_start) {
            setIs_loading(true)
        }
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                setIs_loading(false)
                setIs_fetching(false)
                setReviews(prevState => ([...prevState, ...res.data.data.reviews]))
                setNext_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                setIs_loading(false)
                setIs_fetching(false)
                enqueueSnackbar(err.response.data.errors, {variant: "error"})
            })
    }

    const last_review_ref = useRef(null)
    const show_reviews = reviews.map((review, index) => (
        <Comment
            key={index}
            {...review}
            ref={index === reviews.length - 1 ? last_review_ref : null}
            is_review
            book={review.book}
        />
    ))

    useEffect(() => {
        if (!last_review_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && next_page_url) {
                getReviews(next_page_url, false);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        observer.observe(last_review_ref.current);

        // Cleanup
        return () => {
            if (last_review_ref.current) {
                observer.unobserve(last_review_ref.current);
            }
        };
    }, [next_page_url, is_fetching]);

    return (
        <div className={`flex flex-col gap-y-4`}>
            {show_reviews}
        </div>
    )
}
