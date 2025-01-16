import Footer from "../components/Footer.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {AddOrderErrors, BillingInfo, Book} from "../../Interfaces.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import GlobalInput from "../components/core/GlobalInput.tsx";
import PhoneInput from "react-phone-input-2";
import Sidebar from "../components/checkout/Sidebar.tsx";

export default function CheckOut() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const add_to_cart_count = useSelector((state: RootState) => state.addToCartItemsCountReducer);
    const [cart_books, setCart_books] = useState<Book[]>([]);

    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Step 1", "Step 2", "Step 3"];

    const [billing_info, setBilling_info] = useState<BillingInfo>({
        first_name: '',
        last_name: '',
        city: '',
        street: '',
        phone_number: '',
        country_code: '',
        amount: 0,
        cash_on_delivery: true,
        pay_with_credit_card: false,
    });
    const [errors, setErrors] = useState<AddOrderErrors | null>(null)

    useEffect(() => {
        const query_params = new URLSearchParams(window.location.search)
        const status = query_params.get('status')

        if (status === 'success') setCurrentStep(3)
        if (status === 'failure') setCurrentStep(2)

    }, []);


    const handleBillingInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBilling_info(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const handlePhoneChange = (phone: string, country: any) => {
        setBilling_info({
            ...billing_info,
            phone_number: phone, // The full phone number with country code
            country_code: country.dialCode, // The country code only
        });
    };

    useEffect(() => {
        const books = JSON.parse(localStorage.getItem('book') || '[]');
        setCart_books(books)
    }, [add_to_cart_count]);

    useEffect(() => {
        const handleStorageChange = () => {
            const total_price = JSON.parse(localStorage.getItem('total_price') || '0')
            setBilling_info(prevState => ({
                ...prevState,
                amount: total_price
            }))

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
            <td colSpan={5} className="text-center py-4">{translation.no_products_in_cart}</td>
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
                                    <span className={`absolute w-max mt-1 font-semibold ${index + 1 !== 1 ? '-left-1/2' : ''}`}>
                                            {index + 1 === 1 ? translation.your_cart : index + 1 === 2 ? translation.checkout_details : translation.order_complete}
                                        </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`container pb-10 px-2 mt-10 w-full overflow-auto grid ${currentStep === 2 ? 'md:grid-cols-2 lg:grid-cols-[3fr_2fr] xl:grid-cols-[3fr_1.3fr] 2xl:grid-cols-[3fr_1fr]' : ''} gap-x-10`}>
                    {/* Content */}
                    {currentStep === 1 &&
                        <div className={`flex flex-col gap-y-4 mt-20`}>
                            <div className="flex flex-col ">
                            <div className="overflow-x-hidden">
                                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                {/*<div className="inline-block min-w-full py-2">*/}
                                    <div className="overflow-x-scroll">
                                        <table className="min-w-full ltr:text-left rtl:text-right font-light font-roboto-semi-bold">
                                            <thead className="border-b dark:border-neutral-500">
                                            <tr className={`text-main_color_darker`}>
                                                <th className="px-6 py-4">#</th>
                                                <th className="px-6 py-4">{translation.image}</th>
                                                <th className="px-6 py-4">{translation.title}</th>
                                                <th className="px-6 py-4">{translation.quantity}</th>
                                                <th className="px-6 py-4">{translation.price}</th>
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
                                                        {translation.total}:
                                                    </td>
                                                    <td
                                                        colSpan={1}
                                                        className="px-6 py-4 font-roboto-semi-bold"
                                                        id="totalPrice"
                                                    >
                                                        {billing_info.amount}$
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    }

                    {currentStep === 2 &&
                        <div className={`mt-20`}>
                            <div className={`grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-6 lg:gap-y-10`}>
                                <GlobalInput
                                    label={translation.first_name}
                                    id={`first_name`}
                                    placeholder={translation.first_name}
                                    value={billing_info.first_name}
                                    name={'first_name'}
                                    onChange={handleBillingInfoChange}
                                    error={errors?.first_name}
                                />
                                <GlobalInput
                                    label={translation.last_name}
                                    id={`last_name`}
                                    placeholder={translation.last_name}
                                    value={billing_info.last_name}
                                    name={'last_name'}
                                    onChange={handleBillingInfoChange}
                                    error={errors?.last_name}
                                />
                                <GlobalInput
                                    label={translation.city}
                                    id={`city`}
                                    placeholder={translation.city}
                                    value={billing_info.city}
                                    name={'city'}
                                    onChange={handleBillingInfoChange}
                                    error={errors?.city}
                                />
                                <GlobalInput
                                    label={translation.street_address}
                                    id={`street_address`}
                                    placeholder={translation.street_address}
                                    value={billing_info.street}
                                    name={'street'}
                                    onChange={handleBillingInfoChange}
                                    error={errors?.street}
                                />
                                <div>
                                    <label
                                        className={`block text-gray-700 text-lg font-bold mb-2`}
                                    >
                                        {translation.phone_number}
                                        <span className={`text-red-700 font-roboto-light`}>* </span>
                                    </label>
                                    <PhoneInput
                                        country={'eg'}
                                        value={billing_info.phone_number}
                                        onChange={handlePhoneChange}
                                        enableSearch={true}
                                        placeholder={`Phone Number`}
                                        inputStyle={{
                                            width: '100%',
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: `1px solid ${errors?.phone_number ? 'red' : 'var(--border_color)'}`,
                                            padding: document.dir === 'ltr' ? '10px 10px 10px 45px' : '10px 45px 10px 10px',
                                        }}
                                        containerStyle={{
                                            width: '100%',
                                            height: 'fit-content',
                                            display: 'flex',
                                            alignItems: 'center',
                                            position: 'relative',
                                        }}
                                        buttonStyle={{
                                            border: `1px solid ${errors?.phone_number ? 'red' : 'var(--border_color)'}`,
                                        }}
                                    />
                                    {errors?.phone_number && <span className={`text-red-600 -mt-4`}>{errors.phone_number}</span>}
                                </div>

                            </div>
                        </div>
                    }
                    {/*  Check out Sidebar  */}
                    {currentStep === 2 &&
                        <Sidebar
                            cart_books={cart_books}
                            billing_info={billing_info}
                            setBilling_info={setBilling_info}
                            handleNext={handleNext}
                            setErrors={setErrors}
                        />
                    }
                    {currentStep === 3 &&
                        <div className={`mt-20 flex justify-center items-center`}>
                            <div className={`max-w-lg w-full bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500`}>
                                <div className={`flex items-center space-x-4`}>
                                    <div className={`bg-green-500 text-white rounded-full h-10 w-10 flex justify-center items-center`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className={`w-6 h-6`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className={`text-2xl font-bold text-gray-800`}>
                                        Order Placed Successfully!
                                    </h2>
                                </div>
                                <p className={`mt-4 text-gray-600`}>
                                    Thank you for your order! Your items will be delivered to you within{' '}
                                    <span className={`font-semibold text-gray-900`}>3 business days</span>.
                                </p>
                                <p className={`mt-2 text-gray-600`}>
                                    If you have any questions, feel free to contact our support team.
                                </p>
                                <button
                                    className={`mt-6 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition`}
                                >
                                    View Order Details
                                </button>
                            </div>
                        </div>
                    }
                </div>
                {/* Navigation Buttons */}
                {currentStep < 2 && <div className="container flex justify-end w-full mt-6 pb-6">
                    <button
                        onClick={handleNext}
                        disabled={currentStep === steps.length}
                        className={`px-4 py-2 rounded ${
                            currentStep === steps.length
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-main_color hover:bg-main_color_darker text-white"
                        } transition-all duration-300`}
                    >
                        {translation.proceed_to_checkout_details}
                    </button>
                </div>}
            </div>
            <Footer/>
        </div>
    )
}
