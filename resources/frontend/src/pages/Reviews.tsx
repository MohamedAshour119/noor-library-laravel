import Footer from "../components/Footer.tsx";
import {useEffect, useRef, useState} from "react";
import CategorySidebar from "../components/CategorySidebar.tsx";
import ReviewPlaceholder from "../components/ReviewPlaceholder.tsx";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import Comment from "../components/show-book/Comment.tsx";
import {CommentInterface} from "../../Interfaces.ts";

export default function Reviews() {
    const [is_loading, setIs_loading] = useState(true);
    const [is_fetching, setIs_fetching] = useState(false);
    const [reviews, setReviews] = useState<CommentInterface[]>([]);
    const [reviews_next_page_url, setReviews_next_page_url] = useState('');
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
                setReviews_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                setIs_loading(false)
                setIs_fetching(false)
                enqueueSnackbar(err.response.data.errors, {variant: "error"})
            })
    }

    useEffect(() => {
        getReviews('/get-reviews')
    }, []);

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
            if (entries[0].isIntersecting && !is_fetching && reviews_next_page_url) {
                getReviews(reviews_next_page_url, false);
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
    }, [reviews_next_page_url, is_fetching]);

    return (
        // flex flex-col justify-between min-h-[643px] h-max
        <main className={`flex flex-col justify-between min-h-[643px] h-max items-center bg-main_bg pt-8`}>
            <div className={`container grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8 pb-10`}>
                <div className={`flex flex-col gap-y-4`}>
                    <h1 className={`text-2xl font-roboto-semi-bold`}>Books Reviews</h1>
                    <div className={`pb-4 container w-full flex flex-col gap-y-8`}>
                        {!is_loading && show_reviews}
                    </div>
                    {is_loading &&
                        <div className={`pb-4 container w-full items-center flex flex-wrap sm:grid gap-y-8`}>
                            {Array.from({length: 10}).map((_, index) => (
                                <ReviewPlaceholder key={index}/>
                            ))}
                        </div>
                    }
                </div>
                <aside className={`hidden font-roboto-semi-bold text-2xl text-text_color md:flex flex-col gap-y-8`}>
                    <CategorySidebar/>
                </aside>
            </div>
            <Footer styles={`bg-white`}/>
        </main>

    )
}
