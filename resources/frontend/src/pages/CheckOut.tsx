import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import {Book} from "../../Interfaces.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
export default function CheckOut() {
    const add_to_cart_count = useSelector((state: RootState) => state.addToCartItemsCountReducer);
    const [cart_books, setCart_books] = useState<Book[]>([]);
    const [total_price, setTotal_price] = useState();

    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Step 1", "Step 2", "Step 3"];

    const [billing_info, setBilling_info] = useState({

    });

    useEffect(() => {
        const books = JSON.parse(localStorage.getItem('book') || '[]');
        setCart_books(books)
    }, [add_to_cart_count]);

    useEffect(() => {
        const handleStorageChange = () => {
            const total_price = JSON.parse(localStorage.getItem('total_price') || '0')
            setTotal_price(total_price)

            const previous_books = JSON.parse(localStorage.getItem('book') || '[]');
            setCart_books(previous_books)
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

    const decrementQuantity = (id: number, price: number) => {
        const previous_books = JSON.parse(localStorage.getItem('book') || '[]');
        const book = previous_books.find((item: Book ) => item.id === id)
        if (book.quantity > 1) {
            book.quantity = book.quantity - 1
            localStorage.setItem('book', JSON.stringify(previous_books))

            const previous_total_price = JSON.parse(localStorage.getItem('total_price') || '0')
            localStorage.setItem('total_price', JSON.stringify(previous_total_price - price ))
        }
    }
    const incrementQuantity = (id: number, price: number) => {
        const previous_books = JSON.parse(localStorage.getItem('book') || '[]');
        const book = previous_books.find((item: Book ) => item.id === id)
        book.quantity = book.quantity + 1
        localStorage.setItem('book', JSON.stringify(previous_books))

        const previous_total_price = JSON.parse(localStorage.getItem('total_price') || '0')
        localStorage.setItem('total_price', JSON.stringify(previous_total_price + price ))
    }

    const show_cart_products = cart_books.length > 0 ? (
        cart_books.map((book, index) => (
            <tr key={index} className="border-b dark:border-neutral-500 text-lg">
                <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16"
                    />
                </td>
                <td className="whitespace-nowrap px-6 py-4">{book.title}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => decrementQuantity(book.id, book.price)}
                            className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                        >
                            -
                        </button>
                        <span className="px-3">{book.quantity}</span>
                        <button
                            onClick={() => incrementQuantity(book.id, book.price)}
                            className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                        >
                            +
                        </button>
                    </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{book.price}$</td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={5} className="text-center py-4">No products in cart.</td>
        </tr>
    );

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

    return (
        <div className="flex flex-col justify-between min-h-[643px] h-max text-text_color">
            <div className={`flex flex-col items-center bg-main_bg pt-5 max-sm:px-2 min-h-[586px]`}>
                <div className={`container w-full overflow-auto grid ${currentStep === 2 ? 'grid-cols-[3fr_1fr]' : ''} gap-x-10`}>


                    {/* Content */}
                    <div className={`flex flex-col gap-y-4 mt-20`}>
                        {currentStep === 1 && <div className="flex flex-col mt-10 ">
                            <div className="overflow-x-hidden">
                                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                {/*<div className="inline-block min-w-full py-2">*/}
                                    <div className="overflow-x-scroll">
                                        <table className="min-w-full text-left font-light font-roboto-semi-bold">
                                            <thead className="border-b dark:border-neutral-500">
                                            <tr className={`text-main_color_darker`}>
                                                <th className="px-6 py-4">#</th>
                                                <th className="px-6 py-4">Image</th>
                                                <th className="px-6 py-4">Title</th>
                                                <th className="px-6 py-4">Quantity</th>
                                                <th className="px-6 py-4">Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {show_cart_products}
                                            </tbody>
                                            <tfoot>
                                                <tr className={`text-lg text-main_color_darker`}>
                                                    <td
                                                        colSpan={4}
                                                        className="px-6 py-4 font-roboto-semi-bold "
                                                    >
                                                        Total:
                                                    </td>
                                                    <td
                                                        colSpan={1}
                                                        className="px-6 py-4 font-roboto-semi-bold"
                                                        id="totalPrice"
                                                    >
                                                        {total_price}$
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>

                    {/*  Check out Sidebar  */}
                    {currentStep === 2 && <div className={`bg-red-400`}>Check out Sidebar</div>}
                </div>
                {/* Navigation Buttons */}
                <div className="container flex justify-end w-full mt-6 pb-6">
                    <button
                        onClick={handleNext}
                        disabled={currentStep === steps.length}
                        className={`px-4 py-2 rounded ${
                            currentStep === steps.length
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-main_color hover:bg-main_color_darker text-white"
                        } transition-all duration-300`}
                    >
                        Proceed to checkout details
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
