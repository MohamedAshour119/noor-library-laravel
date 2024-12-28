import {Link} from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import CategorySample from "./home/Category-Sample.tsx";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {clearCategories, setCategories} from "../../redux/categories-slice.ts";
import SidebarCategoryPlaceholder from "./SidebarCategoryPlaceholder.tsx";
import {setIsSearchModalOpenSlice} from "../../redux/is_search_modal_open.ts";

interface Props {
    styles?: string
}
export default function CategorySidebar({styles}: Props) {

    const categories = useSelector((state: RootState) => state.categoriesReducer)
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const dispatch = useDispatch()
    const [is_loading, setIs_loading] = useState(true);
    const handleSearchOpen = () => {
        dispatch(setIsSearchModalOpenSlice(!isSearchModalOpenSlice))
    }
    const getCategories = (page_url: string, fetch_at_start = true) => {
        if (fetch_at_start) {
            setIs_loading(true)
        }
        apiClient().get(page_url)
            .then(res => {
                setIs_loading(false)
                dispatch(setCategories(res.data.data));
            })
            .catch(err => {
                setIs_loading(false)
                enqueueSnackbar(err.response?.data?.errors, {variant: "error"})
            })
    }

    useEffect(() => {
        dispatch(clearCategories());
        getCategories('/get-categories/sidebar');
    }, []);


    const show_categories = Array.isArray(categories) && categories.map((category, index) => (
        <CategorySample
            key={index}
            name={category.name}
        />
    ))

    return (
        <div className={`flex flex-col gap-y-4 h-fit bg-white rounded p-4 border ${styles ? styles : ''}`}>
            <div className={`flex items-center justify-between border-b pb-2 border-main_color`}>
                <Link
                    to={`#`}
                    className={`hover:underline underline-offset-4`}
                >
                    <span className={`font-roboto-semi-bold text-xl`}>Categories</span>
                </Link>
                <button onClick={handleSearchOpen}>
                    <FaSearch className={`size-5 cursor-pointer`}/>
                </button>
            </div>

            <div className={`flex flex-col gap-y-4`}>
                {!is_loading && show_categories}
                <div className={`flex flex-col gap-y-2`}>
                    {is_loading && Array.from({ length: 20 }).map((_, index) => (
                        <SidebarCategoryPlaceholder key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}
