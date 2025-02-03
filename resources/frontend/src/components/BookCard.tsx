import {Ref, useEffect, useState} from "react";
import ReactStars from "react-stars";
import {MdAddShoppingCart} from "react-icons/md";
import {IoIosHeart, IoIosHeartEmpty} from "react-icons/io";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setIsUnauthorizedMessageOpenSlice} from "../../redux/is_unauthorized_message_open.ts";
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

    return (
        <>
            <a
                ref={ref}
                href={`/books/${slug}`}
                className={`${styles ? styles : ''} group relative flex flex-col justify-self-center gap-y-2 md:w-full w-fit items-center border bg-white p-5 rounded-lg hover:border-main_color dark:hover:border-dark_border_color dark:bg-dark_second_color dark:border-dark_second_color dark:text-dark_text_color transition`}
            >
                <div  className={`absolute z-10 bg-main_color_darker/60 dark:bg-dark_main_color/60 w-0 group-hover:w-[60px] transition-all duration-200 left-0 rtl:right-0 top-0 h-full flex justify-center items-center flex-col gap-y-4 ltr:rounded-bl-lg ltr:rounded-tl-lg rtl:rounded-br-lg`}>
                    {!is_free &&
                        <button
                            className={`bg-white dark:bg-dark_border_color p-3 rounded-full w-fit invisible group-hover:visible transition-all duration-75 text-main_color dark:text-dark_text_color hover:bg-main_color dark:hover:bg-dark_second_color hover:text-white dark:hover:text-white`}
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
                        className="relative bg-white dark:bg-dark_border_color p-3 rounded-full w-fit invisible group-hover:visible transition-all duration-75 text-red-600 hover:bg-main_color dark:hover:bg-dark_second_color hover:text-white"
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
                <img src={cover} alt="ShowBook-img" className="rounded border dark:border-dark_border_color p-1" />
                <span className="font-roboto-semi-bold text-lg">
                    {title}
                </span>
                <span className="text-main_color dark:text-dark_text_color/50 font-medium mt-2">
                    {author}
                </span>
                <div className={`border border-main_color dark:border-dark_border_color bg-main_color dark:bg-dark_main_color p-1 px-10 ${is_free ? '!bg-main_bg dark:!bg-dark_border_color !border-border_color dark:!border-dark_main_color !text-text_color dark:!text-white' : ''} size-10 flex items-center justify-center text-white rounded-full`}>
                    {!is_free ? price + '$' : 'Free'}
                </div>
            </a>
        </>

    );
}
