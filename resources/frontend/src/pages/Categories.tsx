import Category from "../components/categories/Category.tsx";
import {MdSearch} from "react-icons/md";
import Footer from "../components/Footer.tsx";
import {useEffect, useRef, useState} from "react";
import {CategoryInterface} from "../../Interfaces.ts";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";

export default function Categories() {

    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [categories_next_page_url, setCategories_next_page_url] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const getCategories = (page_url: string, fetch_at_start = true) => {
        if (fetch_at_start) {
            setIsLoading(true)
        }
        setIsFetching(true)
        apiClient().get(page_url)
            .then(res => {
                setIsLoading(false)
                setIsFetching(false)
                setCategories(prevState => ([...prevState, ...res.data.data.data]))
                setCategories_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                setIsLoading(false)
                setIsFetching(false)
                enqueueSnackbar(err.response.data.errors, {variant: "error"})
            })
    }

    useEffect(() => {
        getCategories('/get-categories')
    }, []);

    const last_category_ref = useRef(null)
    const show_categories = categories.map((category, index) => (
        <Category
            key={index}
            id={category.id}
            title={category.name}
            ref={last_category_ref}
        />
    ))

    useEffect(() => {
        if (!last_category_ref.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetching && categories_next_page_url) {
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
    }, [categories_next_page_url, isFetching]);

    return (
        <div className={`flex flex-col justify-end`}>
            {!isLoading &&
                <div className={`flex flex-col items-center bg-main_bg pt-5 max-sm:px-2`}>
                    <div className={`container w-full flex flex-col gap-y-3`}>
                        <h1 className={`text-2xl font-roboto-semi-bold`}>book categories</h1>

                        <div className="relative">
                            <input
                                type="text"
                                className="w-full px-4 pe-14 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-main_color"
                                placeholder="Search for category"
                            />
                            <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent py-1 px-2 rounded border hover:bg-main_bg hover:border-black/20">
                                <MdSearch size={24} className="text-gray-500"/>
                            </button>
                        </div>

                        <div className={`flex flex-col gap-y-4 pb-4`}>
                            {show_categories}
                        </div>
                    </div>
                </div>
            }
            {isLoading &&
                <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}>
                    <div aria-label="Loading..." role="status" className="flex items-center space-x-2">
                        <svg className="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                            <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="24"></line>
                            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="24"></line>
                            <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="24">
                            </line>
                            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="24"></line>
                            <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="24">
                            </line>
                            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="24"></line>
                            <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="24"></line>
                            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="24">
                            </line>
                        </svg>
                        <span className="text-4xl font-medium text-gray-500">Loading...</span>
                    </div>
                </div>
            }
            {!isLoading && <Footer/>}
        </div>
    )
}
