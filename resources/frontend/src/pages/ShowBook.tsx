import CoolLoading from "../components/CoolLoading.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import apiClient from "../../ApiClient.ts";
import {useParams} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import CategorySidebar from "../components/CategorySidebar.tsx";
import {IoIosHeartEmpty} from "react-icons/io";
import {TfiShoppingCart} from "react-icons/tfi";
import {FaStar} from "react-icons/fa";
import {ShowBookInterface} from "../../Interfaces.ts";
import {languages_options} from "../React-Select-Options.ts";

export default function ShowBook() {
    const { slug } = useParams()
    const [is_loading, setIs_loading] = useState(false);
    const [book_data, setBook_data] = useState<ShowBookInterface>();
    const [is_add_to_cart_icon_hovered, setIs_add_to_cart_icon_hovered] = useState(false);
    const [is_add_to_wishlist_icon_hovered, setIs_add_to_wishlist_icon_hovered] = useState(false);
    const handleAddToCartIconMouseEnter = () => {
        setIs_add_to_cart_icon_hovered(true);
    };
    const handleAddToCartIconMouseLeave = () => {
        setIs_add_to_cart_icon_hovered(false);
    };
    const handleAddToCartWishlistMouseEnter = () => {
        setIs_add_to_wishlist_icon_hovered(true);
    };
    const handleAddToCartWishlistMouseLeave = () => {
        setIs_add_to_wishlist_icon_hovered(false);
    };

    const get_book_language_label = (language_value: string) => {
        const language = languages_options.find(language => language.value === language_value);
        return language ? language.label : undefined;
    };
    const getBookData = () => {
        setIs_loading(true)
        apiClient().get(`/books/${slug}`)
            .then(res => {
                const book_language_label = get_book_language_label(res.data.data.book.language)
                const book = res.data.data.book
                book.language = book_language_label
                setBook_data(book)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => setIs_loading(false))
    }

    useEffect(() => {
        getBookData()
    }, []);

    const display_vendor_name = book_data?.vendor ? (book_data.vendor.first_name[0]?.toUpperCase() + book_data.vendor.first_name.slice(1)) + ' ' + (book_data.vendor?.last_name[0]?.toUpperCase() + book_data.vendor.last_name.slice(1)) : ''

    return (
        <div className="flex flex-col min-h-[669px] text-text_color">
            {!is_loading &&
                <div className={`flex flex-col items-center bg-main_bg max-sm:px-2 h-full min-h-[612px]`}>
                    <div className={`container w-full flex flex-col gap-y-3`}>
                        <div className={`container grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8 py-8`}>

                            <div className="relative bg-white border rounded-lg p-10 w-full md:w-auto"> {/* Main container */}

                                {/* Icons */}
                                <div className={`absolute right-4 top-2 flex gap-x-2`}>
                                    <button
                                        className={`relative flex justify-center items-center bg-main_bg w-fit p-2 rounded-full !size-[44px]`}
                                        onMouseEnter={handleAddToCartIconMouseEnter}
                                        onMouseLeave={handleAddToCartIconMouseLeave}
                                    >
                                        <TfiShoppingCart className={`size-6 text-main_color_darker`}/>
                                        {is_add_to_cart_icon_hovered &&
                                            <div className="icon-popup-clip-path absolute top-12 left-1/2 -translate-x-1/2 w-max bg-gray-100 opacity-75 flex justify-center items-center">
                                                <div className="bg-black px-4 pb-1 pt-2 rounded shadow-md text-white text-sm">
                                                    {/* Your popup content here */}
                                                    <p>Add to cart</p>
                                                </div>
                                            </div>
                                        }
                                    </button>
                                    <button
                                        className={`relative bg-main_bg w-fit p-2 rounded-full`}
                                        onMouseEnter={handleAddToCartWishlistMouseEnter}
                                        onMouseLeave={handleAddToCartWishlistMouseLeave}
                                    >
                                        <IoIosHeartEmpty className={`size-7 text-red-600`}/>
                                        {is_add_to_wishlist_icon_hovered &&
                                            <div className="icon-popup-clip-path absolute top-12 left-1/2 -translate-x-1/2 w-max bg-gray-100 opacity-75 flex justify-center items-center">
                                                <div className="bg-black px-4 pb-1 pt-2 rounded shadow-md text-white text-sm">
                                                    {/* Your popup content here */}
                                                    <p>Add to wishlist</p>
                                                </div>
                                            </div>
                                        }
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row"> {/* Image and details container */}
                                    <div className="mb-4 md:mb-0 md:mr-6"> {/* Image container */}
                                        <img
                                            src={book_data?.cover} // Replace with the actual image URL
                                            alt="Book Cover"
                                            className={`rounded p-1 border`}
                                        />
                                    </div>
                                    <div className={`flex flex-col gap-y-3`}> {/* Text details container */}
                                        <div>
                                            <h2 className="text-xl font-semibold">{book_data?.title}</h2>
                                            <div className="flex items-center text-yellow-500 mb-1"> {/* Ratings stars */}
                                                <div className="flex text-[#E0E0E0]">
                                                    <FaStar />
                                                    <FaStar className="-ml-[2px]" />
                                                    <FaStar className="-ml-[2px]" />
                                                    <FaStar className="-ml-[2px]" />
                                                    <FaStar className="-ml-[2px]" />
                                                </div>
                                                <span className="text-gray-600 ml-1">(1,083 ratings)</span>
                                            </div>
                                        </div>

                                        <div className={`flex flex-col gap-y-2`}> {/* Details list */}
                                            <div><strong>Author:</strong> {book_data?.author}</div>
                                            <div><strong>Category:</strong> {book_data?.category.name}</div>
                                            <div><strong>Language:</strong> {book_data?.language}</div>
                                            <div><strong>Publisher:</strong> {display_vendor_name}</div>
                                            <div><strong>Pages:</strong> 751</div>
                                            <div><strong>File Size:</strong> {book_data?.size} MB</div>
                                            <div><strong>Extension:</strong> PDF</div>
                                            <div><strong>Add Date:</strong> {book_data?.created_at}</div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <CategorySidebar/>
                        </div>
                    </div>
                </div>
            }
            {is_loading &&
                <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}>
                    <CoolLoading/>
                </div>
            }
            {!is_loading &&
                <Footer/>
            }
        </div>
    )
}
