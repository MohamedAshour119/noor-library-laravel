import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { setIsAddToCartSidebarOpenSlice } from "../../redux/is_add_to_card_sidebar_open.ts";
import {IoMdClose} from "react-icons/io";
import CartItem from "./CartItem.tsx";
import {useEffect, useState} from "react";
import {Book} from "../../Interfaces.ts";
import {Link, useLocation} from "react-router-dom";

export default function AddToCartSidebar() {
    const isAddToCartSidebarSlice = useSelector((state: RootState) => state.isAddToCartSidebarReducer.is_open);
    const add_to_cart_count = useSelector((state: RootState) => state.addToCartItemsCountReducer);
    const translation = useSelector((state: RootState) => state.translationReducer)

    const dispatch = useDispatch();

    const [added_books, setAdded_books] = useState<Book[]>([]);
    const [total_price, setTotal_price] = useState(0);

    useEffect(() => {
        const handleStorageChange = () => {
            const total_price = JSON.parse(localStorage.getItem('total_price') || '0')
            setTotal_price(total_price)
        };

        // Listen for custom events
        window.addEventListener('storageChange', handleStorageChange);

        // Monkey-patch localStorage.setItem
        const originalSetItem = localStorage.setItem;
        // @ts-ignore
        localStorage.setItem = function (key, value) {
            // @ts-ignore
            originalSetItem.apply(this, arguments);
            window.dispatchEvent(new Event('storageChange')); // Trigger custom event
        };

        // Cleanup
        return () => {
            window.removeEventListener('storageChange', handleStorageChange);
            localStorage.setItem = originalSetItem; // Restore original setItem
        };
    }, []);


    const closeSidebar = () => {
        dispatch(setIsAddToCartSidebarOpenSlice(false));
    };

    useEffect(() => {
        const books = JSON.parse(localStorage.getItem('book') || '[]');
        setAdded_books(books)
    }, [add_to_cart_count]);


    const show_added_books_in_sidebar = added_books.map((book, index) => (
        <li>
            <CartItem
                key={index}
                {...book}
                is_last_book={added_books.length - 1 === index}
            />
        </li>
    ))

    const location = useLocation()
    useEffect(() => {
        dispatch(setIsAddToCartSidebarOpenSlice(false))
    }, [location.pathname]);

    return (
        <>
            {/* Backdrop */}
            {isAddToCartSidebarSlice && (
                <div
                    className="left-0 top-0 w-screen h-svh fixed z-20 bg-black/70"
                    onClick={closeSidebar}
                ></div>
            )}

            <div
                className={`fixed ltr:right-0 rtl:left-0 top-0 h-full w-[22rem] bg-white dark:bg-dark_main_color dark:text-dark_text_color ltr:shadow-[5px_5px_9px_black] ${isAddToCartSidebarSlice ? 'rtl:shadow-[5px_5px_9px_black] translate-x-0' : 'rtl:shadow-[0px_5px_0px_black] ltr:translate-x-full rtl:-translate-x-full'} border-text_color z-20 transform transition-transform duration-300`}
            >
                <div className="h-full overflow-y-scroll">
                        <div className="p-4 flex justify-between items-center border-b dark:border-dark_border_color">
                            <h2 className="text-lg font-semibold">{translation.cart}</h2>
                            <button
                                className="font-bold text-xl hover:bg-main_bg dark:hover:bg-dark_second_color p-2 rounded-full"
                                onClick={closeSidebar}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                        <ul className="p-4 space-y-2">
                            {show_added_books_in_sidebar}
                        </ul>
                </div>


                <div className={`px-4 absolute bottom-0 pb-4 w-full border-t dark:border-dark_border_color bg-white dark:bg-dark_main_color`}>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold">{translation.total}:</span>
                        <span className="text-2xl font-bold text-green-500">{total_price}$</span>
                    </div>
                    <Link
                        onClick={() => dispatch(setIsAddToCartSidebarOpenSlice(false))}
                        to={`/checkout`}
                        className="block text-center bg-main_color dark:bg-dark_second_color hover:bg-main_color_darker dark:hover:bg-dark_border_color text-white font-bold py-2 px-4 rounded mt-4 w-full">
                            {translation.proceed_to_checkout}
                    </Link>
                </div>
            </div>
        </>
    );
}
