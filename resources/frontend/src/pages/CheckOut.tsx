import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import {Book} from "../../Interfaces.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import Stepper from "../components/stepper.tsx";
export default function CheckOut() {
    const add_to_cart_count = useSelector((state: RootState) => state.addToCartItemsCountReducer);
    const [cart_books, setCart_books] = useState<Book[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Step 1", "Step 2", "Step 3"];

    const [billing_info, setBilling_info] = useState({

    });

    useEffect(() => {
        const books = JSON.parse(localStorage.getItem('book') || '[]');
        setCart_books(books)
    }, [add_to_cart_count]);


    const show_cart_products = cart_books.length > 0 ? (
        cart_books.map((book, index) => (
            <tr key={index} className="border-b dark:border-neutral-500 text-lg">
                <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    <img src={book.cover} alt={book.title} className="size-16 " />
                </td>
                <td className="whitespace-nowrap px-6 py-4">{book.title}</td>
                <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative flex items-center w-28 text-text_color">
                        <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input"
                                className="hover:bg-white transition-all border border-table_border rounded-s-lg p-3 h-11 focus:outline-0">
                            <svg className="w-3 h-3" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="number" id="quantity-input" data-input-counter=""
                               aria-describedby="helper-text-explanation"
                               className="bg-transparent border-x-0 border-y border-table_border h-11 text-center text-sm block w-full py-2.5 dark:placeholder-gray-400 focus:outline-0"
                               required
                        />
                        <button type="button" id="increment-button" data-input-counter-increment="quantity-input"
                                className="hover:bg-white transition-all border border-table_border rounded-e-lg p-3 h-11 focus:outline-0">
                            <svg className="w-3 h-3" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
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
                <div className={`container w-full grid ${currentStep === 2 ? 'grid-cols-[3fr_1fr]' : ''} gap-x-10`}>
                    {/* Progress Bar */}
                    <div className="w-[80%] mx-auto mt-10">
                        <div className="relative">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-main_color rounded-full transition-all duration-300"
                                    style={{ width: progressWidth }}
                                ></div>
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full">
                                {steps.map((_, index) => (
                                    <div className={`relative`}>
                                        <div
                                            key={index}
                                            className={`size-14 flex items-center justify-center rounded-full border-2 ${
                                                currentStep > index
                                                    ? "border-main_color_darker bg-main_color_darker text-white"
                                                    : "border-gray-300 bg-white text-gray-500"
                                            } transition-all duration-300`}
                                        >
                                            {index + 1}
                                        </div>
                                        <span className={`absolute w-max mt-1 ${index + 1 !== 1 ? '-left-1/2' : ''}`}>
                                            {index + 1 === 1 ? 'Your Cart' : index + 1 === 2 ? 'Checkout Details' : 'Order Complete'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={`flex flex-col gap-y-4 mt-20`}>
                        {currentStep === 1 && <div className="flex flex-col mt-10">
                            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full text-left text-sm font-light">
                                            <thead className="border-b font-medium dark:border-neutral-500">
                                            <tr>
                                                <th scope="col" className="px-6 py-4">#</th>
                                                <th scope="col" className="px-6 py-4">Image</th>
                                                <th scope="col" className="px-6 py-4">Title</th>
                                                <th scope="col" className="px-6 py-4">Quantity</th>
                                                <th scope="col" className="px-6 py-4">Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {show_cart_products}
                                            </tbody>
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
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleNext}
                        disabled={currentStep === steps.length}
                        className={`px-4 py-2 rounded ${
                            currentStep === steps.length
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-main text-white"
                        } transition-all duration-300`}
                    >
                        Next
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
