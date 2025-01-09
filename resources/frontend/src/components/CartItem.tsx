import {Book} from "../../Interfaces.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setAddToCartItemsCount} from "../../redux/add-to-cart-items-count.ts";
import {useState} from "react";

interface Props extends Book {
    is_last_book?: boolean
}
export default function CartItem(props: Props) {
    const {title, author, price, cover, id, is_last_book = false} = props
    const translation = useSelector((state: RootState) => state.translationReducer)
    const add_to_cart_count = useSelector((state: RootState) => state.addToCartItemsCountReducer);

    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1);


    const removeItem = () => {
        const all_items = JSON.parse(localStorage.getItem('book') || '[]')
        const filtered_items = all_items.filter((book: Book) => book.id !== id)

        localStorage.setItem('book', JSON.stringify(filtered_items))
        dispatch(setAddToCartItemsCount(add_to_cart_count - 1))
    }

    return (
        <div className={`flex items-center border-b py-4 ${is_last_book && add_to_cart_count > 4 ? 'pb-16' : ''}`}>
            <img src={cover} alt="Cover" className="w-24 h-32 ltr:mr-4 rtl:ml-4"/>
            <div className="flex-1">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-gray-500">{translation.author}: {author}</p>
                <div className={`flex justify-between items-center`}>
                    <p className="text-gray-500">{translation.quantity}: {quantity}</p>
                    <div className="relative flex items-center justify-end w-28 text-text_color">
                        <button
                            type="button"
                            id="decrement-button"
                            data-input-counter-decrement="quantity-input"
                            className="relative hover:bg-white transition-all border border-table_border rounded-s-lg p-3 h-4 focus:outline-0"
                        >
                            <svg className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="number"
                               id="quantity-input"
                               data-input-counter=""
                               aria-describedby="helper-text-explanation"
                               className="bg-transparent border-x-0 border-y border-table_border h-4 py-3 text-center text-sm block w-10 focus:outline-0"
                               required
                        />
                        <button
                            type="button"
                            id="increment-button"
                            data-input-counter-increment="quantity-input"
                            className="relative hover:bg-white transition-all border border-table_border rounded-e-lg p-3 h-4 focus:outline-0"
                        >
                            <svg className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-green-500">{price + '$'}</span>
                    <button
                        onClick={removeItem}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-2 rounded">
                        {translation.remove}
                    </button>
                </div>
            </div>
        </div>
    )
}
