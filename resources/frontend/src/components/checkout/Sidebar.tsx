import {AddOrderErrors, BillingInfo, Book} from "../../../Interfaces.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {Radio} from "flowbite-react";
import {Dispatch, FormEvent, SetStateAction} from "react";
import apiClient from "../../../ApiClient.ts";
import axios from "axios";

interface Props {
    cart_books: Book[]
    billing_info: BillingInfo
    setBilling_info: Dispatch<SetStateAction<BillingInfo>>
    handleNext: () => void
    setErrors: Dispatch<SetStateAction<AddOrderErrors | null>>
}
export default function Sidebar({cart_books, billing_info, setBilling_info, handleNext, setErrors}: Props) {
    const translation = useSelector((state: RootState) => state.translationReducer)

    const show_books = cart_books.map(book => (
        <div className={`flex gap-x-1`}>
            <h1>{book.title}:</h1>
            <span>{book.quantity}</span>
        </div>
    ))

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPayment = event.target.value;
        setBilling_info({
            ...billing_info,
            cash_on_delivery: selectedPayment === "cash_on_delivery",
            pay_with_credit_card: selectedPayment === "pay_with_credit_card",
        });
    };

    const handleSubmit = async (e?: FormEvent) => {
        e?.preventDefault();
        const cart_books_ids = cart_books.map(book => book.id)
        const data = {
            billing_info,
            cart_books_ids,
        }

        try {
            // Step 1: Create an order
            const response = await axios.post("/api/paymob", data, {headers: {
                    'Accept': 'application/json',
                    'Authorization':'Bearer ' + localStorage.getItem('token'),
                }})

            if (response.data.data.url) {
                window.location.href = response.data.data.url;
            }

        } catch (err) {
            // @ts-ignore
            setErrors(err.response.data.errors)
        }
    };

    const placeOrder = () => {
        const cart_books_ids = cart_books.map(book => book.id)
        const data = {
            billing_info,
            cart_books_ids,
        }

        if (billing_info.cash_on_delivery) {
            apiClient().post('/orders/add', data)
                .then(() => handleNext())
                .catch(err => setErrors(err.response.data.errors))
        }else {
            handleSubmit()
        }
    }

    return (
        <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg mt-20 shadow-[0px_0px_12px_-5px]">
            <h2 className="text-lg font-semibold">{translation.your_order}</h2>

            <div>
                {show_books}
            </div>

            <div>
                <div className={`flex items-center gap-x-2`}>
                    <Radio
                        checked={billing_info.cash_on_delivery}
                        id={`cash_on_delivery`}
                        name={`payment_method`}
                        value={`cash_on_delivery`}
                        onChange={handlePaymentChange}
                        className={`focus:ring-0`}
                    />
                    <label htmlFor="cash_on_delivery">{translation.cash_on_delivery}</label>
                </div>
                <div className={`flex items-center gap-x-2`}>
                    <Radio
                        id={`pay_with_credit_card`}
                        name={`payment_method`}
                        value={`pay_with_credit_card`}
                        onChange={handlePaymentChange}
                        className={`focus:ring-0`}
                    />
                    <label htmlFor="pay_with_credit_card">{translation.pay_with_credit_card}</label>
                </div>
            </div>


            <div className={`font-semibold`}>{translation.total + ': '}{billing_info.amount}$</div>

            <button
                onClick={placeOrder}
                className="bg-main_color hover:bg-main_color_darker text-white font-bold py-2 px-4 mt-3 rounded"
            >
                {translation.place_order}
            </button>
        </div>
    )
}
