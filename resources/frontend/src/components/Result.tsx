import {SearchBooks} from "../../Interfaces.ts";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setIsSearchModalOpenSlice} from "../../redux/is_search_modal_open.ts";

interface Props extends SearchBooks{
    styles?: string
}
export default function Result(props: Props) {
    const {slug, title, styles} = props
    const dispatch = useDispatch()

    const closeModal = () => {
        dispatch(setIsSearchModalOpenSlice(false))
    }

    return (
        <Link
            to={`/books/${slug}`}
            className={`border-t px-5 py-2 ${styles ? styles : ''}`}
            onClick={closeModal}
        >
            {title}
        </Link>
    )
}
