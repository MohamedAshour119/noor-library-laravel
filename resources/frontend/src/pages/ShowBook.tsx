// The `ShowBook` component displays detailed information about a book retrieved from an API.
// It includes book details, a loading state, and interactive icons for adding the book to a cart or wishlist.

import CoolLoading from "../components/CoolLoading.tsx";
import Footer from "../components/Footer.tsx";
import { useEffect, useState } from "react";
import apiClient from "../../ApiClient.ts";
import {useParams} from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CategorySidebar from "../components/CategorySidebar.tsx";
import { IoIosHeartEmpty } from "react-icons/io";
import { TfiShoppingCart } from "react-icons/tfi";
import { FaStar } from "react-icons/fa";
import { ShowBookInterface } from "../../Interfaces.ts";
import { languages_options } from "../React-Select-Options.ts";
import PdfPreview from "../components/PdfPreview.tsx";
import BookReviews from "../components/show-book/BookReviews.tsx";

export default function ShowBook() {
    // Extract the book slug from the URL parameters
    const { slug } = useParams();

    // State to track loading status
    const [is_loading, setIs_loading] = useState(false);

    // State to store the fetched book data
    const [book_data, setBook_data] = useState<ShowBookInterface>();

    // States for hover effects on icons
    const [is_add_to_cart_icon_hovered, setIs_add_to_cart_icon_hovered] = useState(false);
    const [is_add_to_wishlist_icon_hovered, setIs_add_to_wishlist_icon_hovered] = useState(false);

    // Handlers for hover effects on the "Add to Cart" icon
    const handleAddToCartIconMouseEnter = () => setIs_add_to_cart_icon_hovered(true);
    const handleAddToCartIconMouseLeave = () => setIs_add_to_cart_icon_hovered(false);

    // Handlers for hover effects on the "Add to Wishlist" icon
    const handleAddToCartWishlistMouseEnter = () => setIs_add_to_wishlist_icon_hovered(true);
    const handleAddToCartWishlistMouseLeave = () => setIs_add_to_wishlist_icon_hovered(false);

    // Fetch the label for the book's language based on its value
    const get_book_language_label = (language_value: string) => {
        const language = languages_options.find(lang => lang.value === language_value);
        return language ? language.label : undefined;
    };

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

    const is_book_free = book_data?.price === 0

    return (
        <div className="flex flex-col min-h-[669px] text-text_color">
            {/* Main container */}
            <div className="flex flex-col items-center bg-main_bg max-sm:px-2 h-full min-h-[612px]">
                    <div className="container grid md:grid-cols-[4fr_3fr] lg:grid-cols-[5fr_1.6fr] gap-x-8 py-8">
                        <div className={`relative overflow-x-hidden flex flex-col justify-between h-fit bg-white border rounded-lg p-10 w-full ${is_loading ? 'min-h-[40rem]' : ''}`}>
                            {/* Loading spinner */}
                            {is_loading && (
                                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                                    <CoolLoading />
                                </div>
                            )}
                            {/* Book details */}
                            {!is_loading && (
                                <>
                                    <div className={`relative overflow-x-hidden gap-x-10 flex justify-between h-fit ${is_book_free ? '2xl:flex-row flex-col' : ''} rounded-lg w-full ${is_loading ? 'min-h-[40rem]' : ''}`}>
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
                                                            className="icon-popup-clip-path absolute top-12 left-1/2 -translate-x-1/2 w-max bg-gray-100 opacity-75 flex justify-center items-center">
                                                            <div
                                                                className="bg-black px-4 pb-1 pt-2 rounded shadow-md text-white text-sm">
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
                                                    <div className="icon-popup-clip-path absolute top-12 left-1/2 -translate-x-1/2 w-max bg-gray-100 opacity-75 flex justify-center items-center">
                                                        <div className="bg-black px-4 pb-1 pt-2 rounded shadow-md text-white text-sm">
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
                                                {/* Book details */}
                                                <div className="flex flex-col gap-y-2">
                                                    <div><strong>Author:</strong> {book_data?.author}</div>
                                                    <div><strong>Category:</strong> {book_data?.category.name}</div>
                                                    <div><strong>Language:</strong> {book_data?.language}</div>
                                                    <div><strong>Publisher:</strong> {display_vendor_name}{display_vendor_name}</div>
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
                                            <div className={`mt-10 flex flex-col gap-y-4 2xl:w-[500px] lg:w-full`}>
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

                                    {/* Book Reviews */}
                                    <BookReviews/>
                                </>
                            )}
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
