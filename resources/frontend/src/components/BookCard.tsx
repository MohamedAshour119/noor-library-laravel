import {Ref, useEffect, useRef, useState} from "react";
import ReactStars from "react-stars";
import {MdAddShoppingCart} from "react-icons/md";
import {IoIosHeart, IoIosHeartEmpty} from "react-icons/io";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setIsUnauthorizedMessageOpenSlice} from "../../redux/is_unauthorized_message_open.ts";
import {Modal} from "flowbite-react";
import {Book} from "../../Interfaces.ts";
import {setAddToCartItemsCount} from "../../redux/add-to-cart-items-count.ts";

interface Props {
    average_ratings?: number;
    id?: number,
    title?: string
    slug?: string
    description?: string
    is_author?: boolean
    is_free?: boolean
    price: number
    author?: string
    language?: string
    cover?: string
    book_file?: string
    downloadable?: boolean
    ref?: Ref<HTMLAnchorElement>
    styles?: string
    ratings_count: number
    is_added_to_wishlist?: boolean
    category?: string
}

export default function BookCard(props: Props) {
    const {average_ratings, title, slug, author, cover, ref, styles, price, ratings_count, is_free, id, is_added_to_wishlist, category } = props

    const auth_user = useSelector((state: RootState) => state.user)
    const translation = useSelector((state: RootState) => state.translationReducer)
    const isUnauthorizedMessageOpenSlice = useSelector((state: RootState) => state.isUnauthorizedMessageOpenReducer.is_open)
    const add_to_cart_items_count = useSelector((state: RootState) => state.addToCartItemsCountReducer)
    const dispatch = useDispatch()

    const [is_add_to_wishlist, setIs_add_to_wishlist] = useState(false);
    const [is_add_to_wishlist_loading, setIs_add_to_wishlist_loading] = useState(false);
    // const [unAuthError, setUnAuthError] = useState('');

    useEffect(() => {
        if (is_added_to_wishlist) {
            setIs_add_to_wishlist(is_added_to_wishlist)
        }
    }, [is_added_to_wishlist]);

    const handleOpenUnauthorizedMessage = () => {
        dispatch(setIsUnauthorizedMessageOpenSlice(true))
    }
    const handleAddToWishlist = () => {
        setIs_add_to_wishlist_loading(true)

        apiClient().post(`/wishlist/add/${id}`)
            .then(() => {
                setIs_add_to_wishlist(true)
            })
            .catch(err => {
                dispatch(setIsUnauthorizedMessageOpenSlice(true))
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => setIs_add_to_wishlist_loading(false))
    }
    const handleDeleteFromWishlist = () => {
        setIs_add_to_wishlist_loading(true)

        apiClient().delete(`/wishlist/delete/${id}`)
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

    const handleAddBookToCart = () => {
        if (!auth_user.is_vendor && auth_user.is_vendor !== null) {
            const previous_books = JSON.parse(localStorage.getItem('book') || '[]');

            const book = {
                id: id,
                cover: cover,
                title: title,
                author: author,
                category: category,
                price: price,
                quantity: 1,
            };

            const is_book_exist = previous_books.some((storedBook: Book) => storedBook.id === id);

            if (is_book_exist) {
                return
            }

            const previous_total_price = JSON.parse(localStorage.getItem('total_price') || '0')
            localStorage.setItem('total_price', JSON.stringify(previous_total_price + book.price))
            localStorage.setItem('book', JSON.stringify([...previous_books, book]));
            dispatch(setAddToCartItemsCount(add_to_cart_items_count + 1));

        } else {
            handleOpenUnauthorizedMessage()
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


    return (
        <>
            {(auth_user.is_vendor || auth_user.is_vendor === null) &&
                <Modal
                    show={isUnauthorizedMessageOpenSlice}
                    onClose={() => dispatch(setIsUnauthorizedMessageOpenSlice(false))}
                    className={`w-[40rem] !absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 animate-fade-in`}
                    ref={modalRef}
                >
                    <Modal.Header className={`!border-b modal-header`}>
                        <h3 className="text-red-600 text-xl font-medium">{translation.unauthorized}</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6 p-5">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                {auth_user.is_vendor ? translation.unauthorized_vendor_message : !auth_user.is_vendor ? translation.must_sign_in : ''}
                            </p>
                        </div>
                    </Modal.Body>
                </Modal>
            }
            <a
                ref={ref}
                href={`/books/${slug}`}
                className={`${styles ? styles : ''} group relative flex flex-col justify-self-center gap-y-2 md:w-full w-fit items-center border bg-white p-5 rounded-lg hover:border-main_color transition`}
            >
                <div  className={`absolute z-10 bg-main_color_darker/60 w-0 group-hover:w-[60px] transition-all duration-200 left-0 rtl:right-0 top-0 h-full flex justify-center items-center flex-col gap-y-4 ltr:rounded-bl-lg ltr:rounded-tl-lg rtl:rounded-br-lg`}>
                    {!is_free &&
                        <button
                            className={`bg-white p-3 rounded-full w-fit invisible group-hover:visible transition-all duration-75 text-main_color hover:bg-main_color hover:text-white`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddBookToCart()
                            }}
                        >
                            <MdAddShoppingCart className={`size-5`}/>
                        </button>
                    }

                    <button
                        className="relative bg-white p-3 rounded-full w-fit invisible group-hover:visible transition-all duration-75 text-red-600 hover:bg-main_color hover:text-white"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleAddToWishlistMessage()
                        }}
                        disabled={is_add_to_wishlist_loading}
                    >
                        {!is_add_to_wishlist && <IoIosHeartEmpty className="size-5 text-red-600"/>}
                        {is_add_to_wishlist && <IoIosHeart  className="size-5 text-red-400"/>}
                    </button>
                </div>
                <div className={`flex items-center gap-x-3`}>
                    <div className={`flex items-center relative`}>
                        <ReactStars
                            count={5}
                            value={average_ratings}
                            size={25}
                            color1={`#d9d9d9`}
                            color2={`#ffc64b`}
                            className={`-ml-1 custom-stars`}
                            edit={false}
                        />
                    </div>
                    <span className={`text-lg`}>({ratings_count})</span>
                </div>
                <img src={cover} alt="ShowBook-img" className="rounded border p-1" />
                <span className="font-roboto-semi-bold text-lg">
                    {title}
                </span>
                <span className="text-main_color font-medium">
                    {author}
                </span>
                <div className={`border border-main_color bg-main_color p-1 px-10 ${is_free ? '!bg-main_bg !border-border_color !text-text_color' : ''} size-10 flex items-center justify-center text-white rounded-full`}>
                    {!is_free ? price + '$' : 'Free'}
                </div>
            </a>
        </>

    );
}
