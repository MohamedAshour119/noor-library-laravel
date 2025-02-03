
import CoolLoading from "../components/CoolLoading.tsx";
import Footer from "../components/Footer.tsx";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import apiClient from "../../ApiClient.ts";
import {Link, useNavigate, useParams} from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CategorySidebar from "../components/CategorySidebar.tsx";
import {IoIosHeart, IoIosHeartEmpty} from "react-icons/io";
import {Book, CommentInterface, ShowBookInterface} from "../../Interfaces.ts";
import PdfPreview from "../components/PdfPreview.tsx";
import BookRatings from "../components/show-book/BookRatings.tsx";
import Comment from "../components/show-book/Comment.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import ReactStars from "react-stars";
import {MdAddShoppingCart} from "react-icons/md";
import {setIsUnauthorizedMessageOpenSlice} from "../../redux/is_unauthorized_message_open.ts";
import {useBookLanguageLabel} from "../hooks/UseBookLanguageLabel.ts";
import {setAddToCartItemsCount} from "../../redux/add-to-cart-items-count.ts";
import {Modal} from "../components/Modal.tsx";

export default function ShowBook() {
    // Extract the book slug from the URL parameters
    const { slug } = useParams();

    const auth_user = useSelector((state: RootState) => state.user)
    const translation = useSelector((state: RootState) => state.translationReducer)
    const isUnauthorizedMessageOpenSlice = useSelector((state: RootState) => state.isUnauthorizedMessageOpenReducer.is_open)
    const add_to_cart_items_count = useSelector((state: RootState) => state.addToCartItemsCountReducer)
    const dispatch = useDispatch()

    const [is_loading, setIs_loading] = useState(false);
    const [is_fetching, setIs_fetching] = useState(false);
    const [book_data, setBook_data] = useState<ShowBookInterface>();
    const [is_add_to_cart_icon_hovered, setIs_add_to_cart_icon_hovered] = useState(false);
    const [is_add_to_wishlist_icon_hovered, setIs_add_to_wishlist_icon_hovered] = useState(false);
    const [comment, setComment] = useState('');
    const [counter, setCounter] = useState(0);
    const [is_comment_loading, setIs_comment_loading] = useState(false);
    const [error, setError] = useState('');
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const [comments_next_page_url, setComments_next_page_url] = useState('');
    const [is_add_to_wishlist, setIs_add_to_wishlist] = useState(false);
    const [is_add_to_wishlist_loading, setIs_add_to_wishlist_loading] = useState(false);
    const handleAddBookToCart = () => {
        const previous_books = JSON.parse(localStorage.getItem('book') || '[]');

        const book = {
            id: book_data?.id,
            cover: book_data?.cover,
            title: book_data?.title,
            author: book_data?.author,
            category: book_data?.category,
            price: book_data?.price,
            quantity: 1,
        };

        const is_book_exist = previous_books.some((storedBook: Book) => storedBook.id === book.id);

        if (is_book_exist) {
            return
        }

        const previous_total_price = JSON.parse(localStorage.getItem('total_price') || '0')
        localStorage.setItem('total_price', JSON.stringify(previous_total_price + book.price))
        localStorage.setItem('book', JSON.stringify([...previous_books, book]));
        dispatch(setAddToCartItemsCount(add_to_cart_items_count + 1));
    };

    useEffect(() => {
        if (book_data?.is_added_to_wishlist) {
            setIs_add_to_wishlist(book_data?.is_added_to_wishlist)
        }
    }, [book_data?.is_added_to_wishlist]);

    const handleAddToWishlist = () => {
        setIs_add_to_wishlist_loading(true)

        apiClient().post(`/wishlist/add/${book_data?.id}`)
            .then(() => {
                setIs_add_to_wishlist(true)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => setIs_add_to_wishlist_loading(false))
    }
    const handleDeleteFromWishlist = () => {
        setIs_add_to_wishlist_loading(true)

        apiClient().delete(`/wishlist/delete/${book_data?.id}`)
            .then(() => {
                setIs_add_to_wishlist(false)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => setIs_add_to_wishlist_loading(false))
    }
    const handleAddToWishlistMessage = () => {
        if (!auth_user.is_vendor) {
            if (is_add_to_wishlist) {
                handleDeleteFromWishlist()
            } else {
                handleAddToWishlist()
            }
        } else {
            handleOpenUnauthorizedMessage()
        }
    }
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
                // book_data={book_data}
                setBook_data={setBook_data}
                ref={index === comments.length - 1 ? last_comment_ref : null}
                {...comment}
                comments={comments}
                setComments={setComments}
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
        if (!auth_user.is_vendor) {
            setIs_comment_loading(true)

            apiClient().post(`/book/comments/${book_data?.id}`, {body: comment})
                .then(res => {
                    setComments(prevState => ([
                        res.data.data.comment,
                        ...prevState,
                    ]))
                    setComment('')
                    setCounter(0)
                    // @ts-ignore
                    setBook_data(prevState => ({
                        ...prevState,
                        comments_count: res.data.data.comments_count
                    }))
                })
                .catch(err => {
                    setError(err.response.data.errors.message)
                })
                .finally(() => setIs_comment_loading(false))
        }else {
            handleOpenUnauthorizedMessage()
        }
    }

    // Handlers for hover effects on the "Add to Cart" icon
    const handleAddToCartIconMouseEnter = () => setIs_add_to_cart_icon_hovered(true);
    const handleAddToCartIconMouseLeave = () => setIs_add_to_cart_icon_hovered(false);

    // Handlers for hover effects on the "Add to Wishlist" icon
    const handleAddToWishlistMouseEnter = () => setIs_add_to_wishlist_icon_hovered(true);
    const handleAddToWishlistMouseLeave = () => setIs_add_to_wishlist_icon_hovered(false);

    // Fetch book data from the API
    const { languageLabel } = useBookLanguageLabel(book_data?.language)

    // Update the language field once the language label is available
    useEffect(() => {
        if (book_data && languageLabel) {
            // @ts-ignore
            setBook_data((prevBookData) => ({
                ...prevBookData,
                language: languageLabel, // Add human-readable language label
            }));
        }
    }, [book_data, languageLabel]);
    const getBookData = () => {
        setIs_loading(true); // Set loading state

        apiClient()
            .get(`/books/${slug}`)
            .then(res => {
                const book = res.data.data.book;
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
    }, [slug]);

    // Capitalize and format the vendor's name
    const display_vendor_name = book_data?.vendor
        ? `${book_data.vendor.first_name[0]?.toUpperCase()}${book_data.vendor.first_name.slice(1)} ${book_data.vendor.last_name[0]?.toUpperCase()}${book_data.vendor.last_name.slice(1)}`
        : "";

    const display_auth_user_name = `${auth_user.first_name[0]?.toUpperCase()}${auth_user.first_name.slice(1)} ${auth_user.last_name[0]?.toUpperCase()}${auth_user.last_name.slice(1)}`;

    const is_book_free = book_data?.price === 0

    const handleOpenUnauthorizedMessage = () => {
        if (auth_user.is_vendor) {
            dispatch(setIsUnauthorizedMessageOpenSlice(true))
        }
    }
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modalRef.current?.contains(e.target as Node)) {
                dispatch(setIsUnauthorizedMessageOpenSlice(false))
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-[669px] text-text_color">
            {auth_user.is_vendor &&
                <Modal
                    isOpen={isUnauthorizedMessageOpenSlice}
                    onClose={() => dispatch(setIsUnauthorizedMessageOpenSlice(false))}
                    header={translation.unauthorized}
                    ref={modalRef}
                >
                    <main className={`p-4 text-gray-500`}>
                        {translation.unauthorized_vendor_message}
                    </main>

                </Modal>
            }
            {/* Main container */}
            <div className="flex flex-col items-center bg-main_bg dark:bg-dark_main_color max-sm:px-2 h-full min-h-[612px]">
                <div className="container grid md:grid-cols-[4fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8 py-8">
                    <div className={`relative overflow-x-hidden flex flex-col gap-y-5`}>
                        <div className={`relative overflow-x-hidden flex flex-col justify-between h-fit bg-white dark:bg-dark_second_color dark:border-dark_border_color border rounded-lg p-10 w-full ${is_loading ? 'min-h-[40rem]' : ''}`}>
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
                                    <div className="absolute ltr:right-4 rtl:left-4 top-2 flex gap-x-2">
                                        {(book_data?.price ?? 0) > 0 &&
                                            <button
                                                className="relative flex justify-center items-center bg-main_bg dark:bg-dark_main_color w-fit p-2 rounded-full !size-[44px]"
                                                onMouseEnter={handleAddToCartIconMouseEnter}
                                                onMouseLeave={handleAddToCartIconMouseLeave}
                                                onClick={() => {
                                                    if (auth_user.is_vendor) {
                                                        handleOpenUnauthorizedMessage()
                                                    }else {
                                                        handleAddBookToCart()
                                                    }
                                                }}
                                            >
                                                <MdAddShoppingCart className="size-6 text-main_color_darker dark:text-dark_text_color"/>
                                                {is_add_to_cart_icon_hovered && (
                                                    <div className="ltr:icon-popup-clip-path-ltr rtl:icon-popup-clip-path-rtl absolute top-1/2 ltr:right-12 rtl:left-12 -translate-y-1/2 w-max bg-transparent opacity-75 flex justify-center items-center">
                                                        <div className="bg-black px-4 py-1 rounded shadow-md text-white text-sm">
                                                            <p>{translation.add_to_cart}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        }
                                        <button
                                            className="relative bg-main_bg dark:bg-dark_main_color w-fit p-2 rounded-full"
                                            onMouseEnter={handleAddToWishlistMouseEnter}
                                            onMouseLeave={handleAddToWishlistMouseLeave}
                                            onClick={handleAddToWishlistMessage}
                                            disabled={is_add_to_wishlist_loading}
                                        >
                                            {!is_add_to_wishlist && <IoIosHeartEmpty className="size-7 text-red-600 dark:text-dark_text_color"/>}
                                            {is_add_to_wishlist && <IoIosHeart  className="size-7 text-red-400"/>}
                                            {is_add_to_wishlist_icon_hovered && (
                                                <div className="ltr:icon-popup-clip-path-ltr rtl:icon-popup-clip-path-rtl absolute top-1/2 ltr:right-12 rtl:left-12 -translate-y-1/2 w-max bg-transparent opacity-75 flex justify-center items-center">
                                                    <div className="bg-black px-4 py-1 rounded shadow-md text-white text-sm">
                                                        <p>{is_add_to_wishlist ? translation.remove_from_wishlist : translation.add_to_wishlist}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                    {/* Book image and text details */}
                                    <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 mt-6 xl:mt-0 dark:text-dark_text_color">
                                        <div className="mb-4 md:mb-0 ltr:md:mr-6 rtl:ml-6">
                                            <img
                                                src={book_data?.cover}
                                                alt="Book Cover"
                                                className="rounded p-1 border dark:border-dark_border_color"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-y-3">
                                            {/* Book title and ratings */}
                                            <div>
                                                <h1 className="text-xl font-semibold">{book_data?.title}</h1>
                                                <div className="flex items-center text-yellow-500 mb-1">
                                                    <span className={`font-roboto-medium`}>
                                                        <ReactStars
                                                            count={5}
                                                            value={book_data?.average}
                                                            size={20}
                                                            color1={`#d9d9d9`}
                                                            color2={`#FFC64BFF`}
                                                            className={`-ml-1`}
                                                            edit={false}
                                                        />
                                                    </span>
                                                    <span className="text-gray-600 dark:text-dark_text_color/70 ltr:ml-1 rtl:mr-1">({book_data?.ratings_count} {translation.ratings})</span>
                                                </div>
                                            </div>
                                            {/* Book details */}
                                            <div className="flex flex-col gap-y-2">
                                                <div><strong>{translation.author}:</strong> {book_data?.author}</div>
                                                <div><strong>{translation.category}:</strong> {book_data?.category}</div>
                                                <div><strong>{translation.language}:</strong> {book_data?.language}</div>
                                                <div>
                                                    <strong>{translation.publisher}: </strong>
                                                    <Link
                                                        to={`/users/${book_data?.vendor.username}`}
                                                        className={`text-main_color_darker dark:text-dark_icon_color`}
                                                    >
                                                        {display_vendor_name}
                                                    </Link>
                                                </div>
                                                <div><strong>{translation.pages}:</strong> {book_data?.pages_count}</div>
                                                <div><strong>{translation.file_size}:</strong> {book_data?.size} MB</div>
                                                <div><strong>{translation.extension}:</strong> PDF</div>
                                                <div><strong>{translation.add_date}:</strong> {book_data?.created_at}</div>
                                            </div>
                                            {/* Purchase button */}
                                            {!is_book_free &&
                                                <div className={`mt-2`}>
                                                    <button
                                                        onClick={() => {
                                                            if (auth_user.is_vendor) {
                                                                handleOpenUnauthorizedMessage()
                                                            } else if (auth_user.id && !auth_user.is_vendor) {
                                                                handleAddBookToCart()
                                                                navigate('/checkout')
                                                            }
                                                        }}
                                                        className="w-full xs:w-auto py-3 px-6 text-white bg-main_color dark:bg-dark_main_color hover:bg-main_color_darker rounded-full text-lg transition">
                                                        {translation.purchase} <strong>{book_data?.price + '$'}</strong>
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
                                                        {translation.download}
                                                    </a>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    {/* Book Preview */}
                                    {is_book_free &&
                                        <div className={`mt-10 flex flex-col gap-y-4 2xl:w-[700px] lg:w-full`}>
                                            <span className={`font-semibold text-lg text-main_color text-center`}>{translation.preview}</span>
                                            <div className={`border flex justify-center max-w-full overflow-x-scroll`}>
                                                {book_data?.book_file && <PdfPreview pdf_file={book_data?.book_file}/>}
                                            </div>
                                        </div>
                                    }
                                    {!is_book_free &&
                                        <div className={`hidden xl:flex items-center xl:w-[60%]`}>
                                            <div className={`bg-[#45b09e26] dark:bg-dark_main_color flex flex-col justify-center h-fit py-4 px-10 rounded-lg text-center`}>
                                                <span className={`font-semibold text-lg text-main_color dark:text-dark_icon_color`}>{translation.preview}</span>
                                                <span className={`dark:text-dark_text_color`}>{translation.preview_not_allowed}</span>
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
                            handleOpenUnauthorizedMessage={handleOpenUnauthorizedMessage}
                        />

                        {/* Book Reviews */}
                        <div className={`flex flex-col gap-y-10 px-5 lg:px-10 py-5 border rounded-lg bg-white dark:bg-dark_second_color dark:text-dark_text_color dark:border-dark_border_color`}>
                            <span className={`font-roboto-semi-bold text-xl`}>{translation.comments} ({book_data?.comments_count})</span>
                            {auth_user.id &&
                                <div className={`bg-white dark:bg-dark_second_color grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr]`}>
                                    <img
                                        src={auth_user.avatar ? auth_user.avatar : '/profile-default-img.svg'}
                                        alt="trending-active"
                                        className={`size-12 rounded-full`}
                                    />
                                    <form
                                        onSubmit={handleSubmitComment}
                                        className={`bg-main_bg dark:bg-dark_main_color dark:border dark:border-dark_border_color px-5 py-2 gap-y-2 rounded-lg grid`}
                                    >
                                        <span className={`font-roboto-semi-bold`}>{display_auth_user_name}</span>
                                        <div className={`relative`}>
                                            <textarea
                                                onClick={handleOpenUnauthorizedMessage}
                                                placeholder={translation.comment_description}
                                                className={`p-3 pt-4 rounded min-h-28 focus:outline-0 w-full dark:bg-dark_second_color`}
                                                maxLength={1000}
                                                value={comment}
                                                onChange={handleCommentChange}
                                            />
                                            {error.length > 0 && <span className={`text-red-500`}>{error}</span>}
                                            <span
                                                className={`absolute text-main_color_darker dark:text-dark_text_color z-10 ltr:right-2 rtl:left-2 top-0 text-xs w-[97%] bg-white dark:bg-dark_second_color text-end`}>
                                                {counter}/1000
                                            </span>
                                        </div>

                                        <button
                                            disabled={is_comment_loading}
                                            className={`bg-main_color dark:bg-dark_second_color dark:border dark:border-dark_border_color w-fit text-white px-4 py-1 rounded justify-self-end mt-1 hover:bg-main_color_darker transition`}
                                        >
                                            {translation.comment}
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
