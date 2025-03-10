import Category from "../components/categories/Category.tsx";
import Footer from "../components/Footer.tsx";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {CategoryInterface} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import useDebounce from "../hooks/UseDebounce.tsx";
import {IoMdClose} from "react-icons/io";
import CoolLoading from "../components/CoolLoading.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

export default function Categories() {
    const translation = useSelector((state: RootState) => state.translationReducer)

    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [categories_next_page_url, setCategories_next_page_url] = useState('');
    const [is_fetching, setIs_fetching] = useState(false);
    const [is_loading, setIs_loading] = useState(true);
    const [search_value, setSearch_value] = useState('');
    const [search_loading, setSearch_loading] = useState(false);
    const search_input_ref = useRef<HTMLInputElement | null>(null)
    const [is_focused, setIs_focused] = useState(false);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch_value(e.target.value)
    }

    const getCategories = (page_url: string, fetch_at_start = true) => {
        if (fetch_at_start) {
            setIs_loading(true)
        }
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                setIs_loading(false)
                setIs_fetching(false)
                setCategories(prevState => ([...prevState, ...res.data.data.data]))
                setCategories_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                setIs_loading(false)
                setIs_fetching(false)
                enqueueSnackbar(err.response.data.errors, {variant: "error"})
            })
    }

    useEffect(() => {
        getCategories('/get-categories')
    }, []);

    const last_category_ref = useRef(null)
    const show_categories = categories?.map((category, index) => (
        <Category
            key={index}
            id={category.id}
            name={category.name}
            slug={category.slug}
            ref={index === categories.length - 1 ? last_category_ref : null}
            books_count={category.books_count}
        />
    ))

    useEffect(() => {
        if (!last_category_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && categories_next_page_url) {
                getCategories(categories_next_page_url, false);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        observer.observe(last_category_ref.current);

        // Cleanup
        return () => {
            if (last_category_ref.current) {
                observer.unobserve(last_category_ref.current);
            }
        };
    }, [categories_next_page_url, is_fetching]);

    const getSearchingResults = (keyword: string) => {
        setIs_fetching(true)
        setSearch_loading(true)

        apiClient().get(`/search-category/${keyword}`)
            .then(res => {
                setCategories(res.data.data.results)
                setCategories_next_page_url(res.data.data.next_page_url)
                setSearch_loading(false)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors, {variant: "error"})
                setIs_fetching(false)
                setSearch_loading(false)
            })
    }

    const debounce_value = useDebounce(search_value)

    useEffect(() => {
        if (debounce_value?.length > 0) {
            getSearchingResults(debounce_value);
        }
    }, [debounce_value]);

    const clearSearchInput = () => {
        setSearch_value('')
        getCategories('/get-categories')
        setIs_focused(false)
    }


    return (
        <div className="flex flex-col justify-between min-h-[643px] h-max text-text_color">
            {!is_loading &&
                <div className={`flex flex-col items-center bg-main_bg dark:bg-dark_main_color dark:text-dark_text_color pt-5 max-sm:px-2 min-h-[586px]`}>
                    <div className={`container w-full flex flex-col gap-y-3`}>
                        <h1 className={`text-2xl font-roboto-semi-bold`}>{translation.categories_title}</h1>

                        <div className="relative">
                            <input
                                ref={search_input_ref}
                                type="text"
                                className="w-full px-4 pe-14 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-main_color dark:bg-dark_second_color dark:border-dark_border_color"
                                placeholder={translation.search_for_category}
                                value={search_value}
                                onChange={handleSearchChange}
                                onFocus={() => setIs_focused(true)}
                                onBlur={() => setIs_focused(false)}
                            />
                            {(search_value.length > 0 || is_focused) &&
                                <button
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={clearSearchInput}
                                    className="absolute ltr:right-2 rtl:left-2 top-1/2 transform -translate-y-1/2 bg-transparent py-1 px-2 rounded border dark:border-dark_border_color hover:bg-main_bg hover:border-black/20 dark:hover:bg-dark_border_color dark:hover:border-dark_icon_color">
                                    <IoMdClose size={24} className="text-gray-500 dark:text-dark_text_color"/>
                                </button>
                            }
                        </div>

                        <div className={`flex flex-col gap-y-4 pb-4`}>
                            {!search_loading && show_categories}
                            {search_loading &&
                                <div className={`flex justify-center pt-40`}>
                                    <CoolLoading/>
                                </div>
                            }
                            {search_value.length > 0 && categories?.length === 0 &&
                                <>
                                    <div className="w-full flex items-center flex-wrap justify-center gap-10 pt-20 lg:pt-28">
                                        <div className="grid gap-4 w-60">
                                            <svg
                                                className="mx-auto"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="116"
                                                height="121"
                                                viewBox="0 0 116 121"
                                                fill="none"
                                            >
                                                <path
                                                    d="M72.7942 0.600875L72.7942 0.600762L72.7836 0.599331C72.3256 0.537722 71.8622 0.5 71.3948 0.5H22.1643C17.1256 0.5 13.0403 4.56385 13.0403 9.58544V107.286C13.0403 112.308 17.1256 116.372 22.1643 116.372H93.1214C98.1725 116.372 102.245 112.308 102.245 107.286V29.4482C102.245 28.7591 102.17 28.0815 102.019 27.4162L102.019 27.416C101.615 25.6459 100.67 24.0014 99.2941 22.7574C99.2939 22.7572 99.2937 22.757 99.2934 22.7568L77.5462 2.89705C77.5461 2.89692 77.5459 2.89679 77.5458 2.89665C76.2103 1.66765 74.5591 0.876968 72.7942 0.600875Z"
                                                    fill="white"
                                                    stroke="#E5E7EB"
                                                />
                                                <circle cx="60.2069" cy="61" r="21.0256" fill="#EEF2FF" />
                                                <path
                                                    d="M74.6786 46.1412L74.6783 46.1409C66.5737 38.0485 53.4531 38.0481 45.36 46.1412C37.2552 54.2341 37.2551 67.3666 45.3597 75.4596C53.4529 83.5649 66.5739 83.5645 74.6786 75.4599C82.7716 67.3669 82.7716 54.2342 74.6786 46.1412ZM79.4694 41.3508C90.2101 52.0918 90.2101 69.5093 79.4694 80.2502C68.7166 90.9914 51.3104 90.9915 40.5576 80.2504C29.8166 69.5095 29.8166 52.0916 40.5576 41.3506C51.3104 30.6096 68.7166 30.6097 79.4694 41.3508Z"
                                                    stroke="#E5E7EB"
                                                />
                                                <path
                                                    d="M83.2471 89.5237L76.8609 83.1309C78.9391 81.5058 80.8156 79.6106 82.345 77.6546L88.7306 84.0468L83.2471 89.5237Z"
                                                    stroke="#E5E7EB"
                                                />
                                                <path
                                                    d="M104.591 94.4971L104.59 94.4969L92.7346 82.653C92.7342 82.6525 92.7337 82.652 92.7332 82.6515C91.6965 81.6018 90.0076 81.6058 88.9629 82.6505L89.3089 82.9965L88.9629 82.6505L81.8573 89.7561C80.8213 90.7921 80.8248 92.4783 81.8549 93.5229L81.8573 93.5253L93.7157 105.384C96.713 108.381 101.593 108.381 104.591 105.384C107.6 102.375 107.6 97.5062 104.591 94.4971Z"
                                                    fill="#A5B4FC"
                                                    stroke="#818CF8"
                                                />
                                                <path
                                                    d="M62.5493 65.6714C62.0645 65.6714 61.6626 65.2694 61.6626 64.7729C61.6626 62.7866 58.6595 62.7866 58.6595 64.7729C58.6595 65.2694 58.2576 65.6714 57.761 65.6714C57.2762 65.6714 56.8743 65.2694 56.8743 64.7729C56.8743 60.422 63.4478 60.4338 63.4478 64.7729C63.4478 65.2694 63.0458 65.6714 62.5493 65.6714Z"
                                                    fill="#4F46E5"
                                                />
                                                <path
                                                    d="M70.1752 58.0694H66.4628C65.9662 58.0694 65.5642 57.6675 65.5642 57.1709C65.5642 56.6862 65.9662 56.2842 66.4628 56.2842H70.1752C70.6717 56.2842 71.0737 56.6862 71.0737 57.1709C71.0737 57.6675 70.6717 58.0694 70.1752 58.0694Z"
                                                    fill="#4F46E5"
                                                />
                                                <path
                                                    d="M53.8596 58.0693H50.1472C49.6506 58.0693 49.2487 57.6673 49.2487 57.1708C49.2487 56.686 49.6506 56.2841 50.1472 56.2841H53.8596C54.3443 56.2841 54.7463 56.686 54.7463 57.1708C54.7463 57.6673 54.3443 58.0693 53.8596 58.0693Z"
                                                    fill="#4F46E5"
                                                />
                                                <rect
                                                    x="28.9248"
                                                    y="16.3846"
                                                    width="30.7692"
                                                    height="2.05128"
                                                    rx="1.02564"
                                                    fill="#4F46E5"
                                                />
                                                <rect
                                                    x="28.9248"
                                                    y="100.487"
                                                    width="41.0256"
                                                    height="4.10256"
                                                    rx="2.05128"
                                                    fill="#A5B4FC"
                                                />
                                                <rect
                                                    x="28.9248"
                                                    y="22.5385"
                                                    width="10.2564"
                                                    height="2.05128"
                                                    rx="1.02564"
                                                    fill="#4F46E5"
                                                />
                                                <circle cx="42.2582" cy="23.5641" r="1.02564" fill="#4F46E5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-center text-text_color/70 dark:text-dark_text_color text-xl font-semibold leading-relaxed pb-1">{translation.category_not_found}</h2>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
            {is_loading &&
                <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}>
                    <CoolLoading/>
                </div>
            }

            {!is_loading &&
                <Footer/>
            }
        </div>
    );

}
