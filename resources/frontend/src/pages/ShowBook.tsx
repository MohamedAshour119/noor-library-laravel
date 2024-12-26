// The `ShowBook` component displays detailed information about a book retrieved from an API.
// It includes book details, a loading state, and interactive icons for adding the book to a cart or wishlist.

import CoolLoading from "../components/CoolLoading.tsx";
import Footer from "../components/Footer.tsx";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import apiClient from "../../ApiClient.ts";
import {Link, useParams} from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CategorySidebar from "../components/CategorySidebar.tsx";
import { IoIosHeartEmpty } from "react-icons/io";
import { TfiShoppingCart } from "react-icons/tfi";
import {CommentInterface, ShowBookInterface} from "../../Interfaces.ts";
import PdfPreview from "../components/PdfPreview.tsx";
import BookRatings from "../components/show-book/BookRatings.tsx";
import {get_book_language_label} from "../Utilities/getBookLanguageLabel.ts";
import Comment from "../components/show-book/Comment.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import ReactStars from "react-stars";

export default function ShowBook() {
    // Extract the book slug from the URL parameters
    const { slug } = useParams();

    const auth_user = useSelector((state: RootState) => state.user)

    // State to track loading status
    const [is_loading, setIs_loading] = useState(false);
    const [is_fetching, setIs_fetching] = useState(false);
    // State to store the fetched book data
    const [book_data, setBook_data] = useState<ShowBookInterface>();

    // States for hover effects on icons
    const [is_add_to_cart_icon_hovered, setIs_add_to_cart_icon_hovered] = useState(false);
    const [is_add_to_wishlist_icon_hovered, setIs_add_to_wishlist_icon_hovered] = useState(false);
    const [comment, setComment] = useState('');
    const [counter, setCounter] = useState(0);
    const [is_comment_loading, setIs_comment_loading] = useState(false);
    const [error, setError] = useState('');
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const [comments_next_page_url, setComments_next_page_url] = useState('');

    const getComments = (page_url: string) => {
        setIs_fetching(true)
        setIs_loading(true)

        apiClient().get(page_url)
            .then(res => {
                setComments(res.data.data.comments)
                setComments_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.message, {variant: "error"})
            })
            .finally(() => {
                setIs_loading(false)
                setIs_fetching(false)
            })
    }

    // For getting comments at the beginning
    useEffect(() => {
        if (book_data?.id !== undefined && comments.length === 0) {
            getComments(`/book/${book_data?.id}/comments`);
        }
    }, [book_data?.id]);

    const getNextComments = (page_url: string) => {
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                setComments(prevState => [...prevState, ...res.data.data.comments])
                setComments_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.message, {variant: "error"})
            })
            .finally(() => {
                setIs_fetching(false)
            })
    }

    const last_comment_ref = useRef(null);

    useEffect(() => {
        if (!last_comment_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && comments_next_page_url) {
                getNextComments(comments_next_page_url);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        observer.observe(last_comment_ref.current);

        // Cleanup
        return () => {
            if (last_comment_ref.current) {
                observer.unobserve(last_comment_ref.current);
            }
        };
    }, [comments_next_page_url, is_fetching]);

    const show_comments = comments.map((comment, index) => (
            <Comment
                key={index}
                book_data={book_data}
                setBook_data={setBook_data}
                ref={index === comments.length - 1 ? last_comment_ref : null}
                {...comment}
            />
        )
    )
    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target
        setComment(value)
        setCounter(value.length)
    }
    const handleSubmitComment = (e: FormEvent) => {
        e.preventDefault()
        setIs_comment_loading(true)

        apiClient().post(`/book/comments/${book_data?.id}`, {body: comment})
            .then(res => {
                setComments(prevState => ([
                    res.data.data.comment,
                    ...prevState,
                ]))
                setComment('')
                setCounter(0)
            })
            .catch(err => {
                setError(err.response.data.errors.body[0])
            })
            .finally(() => setIs_comment_loading(false))
    }

    // Handlers for hover effects on the "Add to Cart" icon
    const handleAddToCartIconMouseEnter = () => setIs_add_to_cart_icon_hovered(true);
    const handleAddToCartIconMouseLeave = () => setIs_add_to_cart_icon_hovered(false);

    // Handlers for hover effects on the "Add to Wishlist" icon
    const handleAddToCartWishlistMouseEnter = () => setIs_add_to_wishlist_icon_hovered(true);
    const handleAddToCartWishlistMouseLeave = () => setIs_add_to_wishlist_icon_hovered(false);

    // Fetch book data from the API
    const getBookData = () => {
        setIs_loading(true); // Set loading state

        apiClient()
            .get(`/books/${slug}`)
            .then(res => {
                const book_language_label = get_book_language_label(res.data.data.book.language);
                const book = res.data.data.book;
                book.language = book_language_label; // Add human-readable language label
                setBook_data(book); // Update book data state
            })
            .catch(err => {
                enqueueSnackbar(err.response?.data?.errors || "Error fetching book data");
            })
            .finally(() => setIs_loading(false)); // Reset loading state
    };

    // Fetch book data when the component mounts
    useEffect(() => {
        getBookData();
    }, []);

    // Capitalize and format the vendor's name
    const display_vendor_name = book_data?.vendor
        ? `${book_data.vendor.first_name[0]?.toUpperCase()}${book_data.vendor.first_name.slice(1)} ${book_data.vendor.last_name[0]?.toUpperCase()}${book_data.vendor.last_name.slice(1)}`
        : "";

    const display_auth_user_name = `${auth_user.first_name[0]?.toUpperCase()}${auth_user.first_name.slice(1)} ${auth_user.last_name[0]?.toUpperCase()}${auth_user.last_name.slice(1)}`;

    const is_book_free = book_data?.price === 0

    return (
        <div className="flex flex-col min-h-[669px] text-text_color">
            {/* Main container */}
            <div className="flex flex-col items-center bg-main_bg max-sm:px-2 h-full min-h-[612px]">
                    <div className="container grid md:grid-cols-[4fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8 py-8">
                        <div className={`relative overflow-x-hidden flex flex-col gap-y-5`}>
                            <div className={`relative overflow-x-hidden flex flex-col justify-between h-fit bg-white border rounded-lg p-10 w-full ${is_loading ? 'min-h-[40rem]' : ''}`}>
                                    {/* Loading spinner */}
                                    {is_loading && (
                                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                                            <CoolLoading />
                                        </div>
                                    )}
                                    {/* Book details */}
                                    {!is_loading && (
                                        <div className={` overflow-x-hidden gap-x-10 flex justify-between h-fit ${is_book_free ? '2xl:flex-row flex-col' : ''} rounded-lg w-full ${is_loading ? 'min-h-[40rem]' : ''}`}>
                                            {/* Action icons */}
                                            <div className="absolute right-4 top-2 flex gap-x-2">
                                                {(book_data?.price ?? 0) > 0 &&
                                                    <button
                                                        className="relative flex justify-center items-center bg-main_bg w-fit p-2 rounded-full !size-[44px]"
                                                        onMouseEnter={handleAddToCartIconMouseEnter}
                                                        onMouseLeave={handleAddToCartIconMouseLeave}
                                                    >
                                                        <TfiShoppingCart className="size-6 text-main_color_darker"/>
                                                        {is_add_to_cart_icon_hovered && (
                                                            <div
                                                                className="icon-popup-clip-path absolute top-1/2 right-12 -translate-y-1/2 w-max bg-gray-100 opacity-75 flex justify-center items-center">
                                                                <div
                                                                    className="bg-black px-4 py-1 rounded shadow-md text-white text-sm">
                                                                    <p>Add to cart</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                }
                                                <button
                                                    className="relative bg-main_bg w-fit p-2 rounded-full"
                                                    onMouseEnter={handleAddToCartWishlistMouseEnter}
                                                    onMouseLeave={handleAddToCartWishlistMouseLeave}
                                                >
                                                    <IoIosHeartEmpty className="size-7 text-red-600" />
                                                    {is_add_to_wishlist_icon_hovered && (
                                                        <div className="icon-popup-clip-path absolute top-1/2 right-12 -translate-y-1/2 w-max bg-gray-100 opacity-75 flex justify-center items-center">
                                                            <div className="bg-black px-4 py-1 rounded shadow-md text-white text-sm">
                                                                <p>Add to wishlist</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                            {/* Book image and text details */}
                                            <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 mt-6 xl:mt-0">
                                                <div className="mb-4 md:mb-0 md:mr-6">
                                                    <img
                                                        src={book_data?.cover}
                                                        alt="Book Cover"
                                                        className="rounded p-1 border"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-y-3">
                                                    {/* Book title and ratings */}
                                                    <div>
                                                        <h2 className="text-xl font-semibold">{book_data?.title}{book_data?.title}{book_data?.title}</h2>
                                                        <div className="flex items-center text-yellow-500 mb-1">
                                                            <span className={`font-roboto-medium`}>
                                                                <ReactStars
                                                                    count={5}
                                                                    value={book_data?.average}
                                                                    size={20}
                                                                    color1={`#d9d9d9`}
                                                                    color2={`#ffe34b`}
                                                                    className={`-ml-1`}
                                                                    edit={false}
                                                                />
                                                            </span>
                                                            <span className="text-gray-600 ml-1">({book_data?.ratings_count} ratings)</span>
                                                        </div>
                                                    </div>
                                                    {/* Book details */}
                                                    <div className="flex flex-col gap-y-2">
                                                        <div><strong>Author:</strong> {book_data?.author}</div>
                                                        <div><strong>Category:</strong> {book_data?.category}</div>
                                                        <div><strong>Language:</strong> {book_data?.language}</div>
                                                        <div>
                                                            <strong className={`text-text_color`}>Publisher: </strong>
                                                            <Link
                                                                to={`/users/${book_data?.vendor.username}`}
                                                                className={`text-main_color_darker`}
                                                            >
                                                                {display_vendor_name}
                                                            </Link>
                                                        </div>
                                                        <div><strong>Pages:</strong> {book_data?.pages_count}</div>
                                                        <div><strong>File Size:</strong> {book_data?.size} MB</div>
                                                        <div><strong>Extension:</strong> PDF</div>
                                                        <div><strong>Add Date:</strong> {book_data?.created_at}</div>
                                                    </div>
                                                    {/* Purchase button */}
                                                    {!is_book_free &&
                                                        <div className={`mt-2`}>
                                                            <button
                                                                className="w-full xs:w-auto py-3 px-6 text-white bg-main_color hover:bg-main_color_darker rounded-full text-lg transition">
                                                                Purchase <strong>{book_data?.price + '$'}</strong>
                                                            </button>
                                                        </div>
                                                    }
                                                    {is_book_free &&
                                                        <div className={`mt-2`}>
                                                            <a
                                                                href={book_data?.book_file}
                                                                download
                                                                className="w-full xs:w-auto py-3 px-6 text-white bg-main_color hover:bg-main_color_darker rounded-full text-lg transition"
                                                            >
                                                                Download
                                                            </a>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            {/* Book PReview */}
                                            {is_book_free &&
                                                <div className={`mt-10 flex flex-col gap-y-4 2xl:w-[700px] lg:w-full`}>
                                                    <h1 className={`font-semibold text-lg text-main_color text-center`}>Preview</h1>
                                                    <div className={`border flex justify-center max-w-full overflow-x-scroll`}>
                                                        {book_data?.book_file && <PdfPreview pdf_file={book_data?.book_file}/>}
                                                    </div>
                                                </div>
                                            }
                                            {!is_book_free &&
                                                <div className={`hidden xl:flex items-center xl:w-[60%]`}>
                                                    <div className={`bg-[#45b09e26] flex flex-col justify-center h-fit py-4 px-10 rounded-lg text-center`}>
                                                        <h1 className={`font-semibold text-lg text-main_color`}>Preview</h1>
                                                        <h1>Preview is not allowed because the book is not free.</h1>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )}
                            </div>

                            {/* Book Ratings */}
                            <BookRatings
                                book_id={book_data?.id}
                                setBook_data={setBook_data}
                                book_data={book_data}
                            />

                            {/* Book Reviews */}
                            <div className={`flex flex-col gap-y-10 px-5 lg:px-10 py-5 border rounded-lg bg-white`}>
                                <h1 className={`font-roboto-semi-bold text-xl`}>Comments ({book_data?.comments_count})</h1>
                                {auth_user.id &&
                                    <div className={`bg-white grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr]`}>
                                        <img
                                            src={auth_user.avatar ? auth_user.avatar : '/profile-default-img.svg'}
                                            alt="trending-active"
                                            className={`size-12 rounded-full`}
                                        />
                                        <form
                                            onSubmit={handleSubmitComment}
                                            className={`bg-main_bg px-5 py-2 gap-y-2 rounded-lg grid`}
                                        >
                                            <h1 className={`font-roboto-semi-bold`}>{display_auth_user_name}</h1>
                                            <div className={`relative`}>
                                                <textarea
                                                    placeholder={`Comment Description Here`}
                                                    className={`p-3 pt-4 rounded min-h-28 focus:outline-0 w-full`}
                                                    maxLength={1000}
                                                    value={comment}
                                                    onChange={handleCommentChange}
                                                />
                                                {error.length > 0 && <span className={`text-red-500`}>{error}</span>}
                                                <span
                                                    className={`absolute text-main_color_darker z-10 right-2 top-0 text-xs w-[97%] bg-white text-end`}>
                                                    {counter}/1000
                                                </span>
                                            </div>

                                            <button
                                                type={"submit"}
                                                disabled={is_comment_loading}
                                                className={`bg-main_color w-fit text-white px-4 py-1 rounded justify-self-end mt-1 hover:bg-main_color_darker transition`}
                                            >
                                                Comment
                                            </button>
                                        </form>
                                    </div>
                                }
                                <div className={`flex flex-col gap-y-10`}>
                                    {show_comments}
                                </div>
                            </div>

                        </div>
                        {/* Sidebar for categories */}
                        <div className={`hidden md:block`}>
                            <CategorySidebar />
                        </div>
                </div>
            </div>
            {/* Footer */}
            {!is_loading && <Footer />}
        </div>
    );
}
