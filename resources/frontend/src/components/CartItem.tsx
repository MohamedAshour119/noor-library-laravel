import {Book} from "../../Interfaces.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setAddToCartItemsCount} from "../../redux/add-to-cart-items-count.ts";

interface Props extends Book {
    is_last_book?: boolean
}
export default function CartItem(props: Props) {
    const {title, author, category, price, cover, id, is_last_book = false} = props
    const translation = useSelector((state: RootState) => state.translationReducer)
    const add_to_cart_count = useSelector((state: RootState) => state.addToCartItemsCountReducer);

    const dispatch = useDispatch()

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
                <p className="text-gray-500">{translation.category}: {category}</p>
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
