import CategorySidebar from "../components/CategorySidebar.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useRef, useState} from "react";
import {BookCardInterface} from "../../Interfaces.ts";
import BookPlaceholder from "../components/BookPlaceholder.tsx";
import BookCard from "../components/BookCard.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";

export default function SearchBookResults() {
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const [results, setResults] = useState<BookCardInterface[]>([]);
    const [results_next_page_url, setResults_next_page_url] = useState('');
    const [show_placeholders, setShow_placeholders] = useState(true);
    const [is_fetching, setIs_fetching] = useState(false);

    const getStoredResults = () => {
        const stored_results = localStorage.getItem('books_results')
        const stored_results_next_page_url = localStorage.getItem('books_results_next_page_url')

        if (stored_results_next_page_url !== results_next_page_url) {
            setShow_placeholders(true)
        }

        if (stored_results && stored_results_next_page_url) {
            setTimeout(() => {
                setShow_placeholders(false)
            }, 1000)
            setResults(JSON.parse(stored_results))
            setResults_next_page_url(stored_results_next_page_url)
        }
    }

    useEffect(() => {
        if (!isSearchModalOpenSlice) {
            getStoredResults()
        }
    }, [isSearchModalOpenSlice]);

    const last_result_ref = useRef<HTMLAnchorElement>(null);
    const show_results = results.map((book, index) => (
            <BookCard
                key={index}
                {...book}
                ref={index === results.length - 1 ? last_result_ref : null}
            />
        )
    )

    const getNextResults = (page_url: string) => {
        setIs_fetching(true)
        apiClient().get(page_url)
            .then(res => {
                console.log(res.data.data)
                setResults(prevState => [...prevState, ...res.data.data.results])
                setResults_next_page_url(res.data.data.next_page_url)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.message, {variant: "error"})
            })
            .finally(() => {
                setIs_fetching(false)
            })
    }

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !is_fetching && results_next_page_url && !show_placeholders) {
                getNextResults(results_next_page_url);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        if (last_result_ref.current) {
            observer.observe(last_result_ref.current);
        }

        // Cleanup
        return () => {
            if (last_result_ref.current) {
                observer.unobserve(last_result_ref.current);
            }
        };
    }, [results_next_page_url, is_fetching, show_placeholders]);

    return (
        <main className={`flex flex-col justify-between min-h-[643px] h-max items-center bg-main_bg pt-8`}>
            <div className={`container grid md:grid-cols-[5fr_2fr] lg:grid-cols-[5fr_1.6fr] gap-x-8 pb-10`}>
                <div className={`flex flex-col gap-y-4`}>
                    <h1 className={`text-2xl font-roboto-semi-bold`}>Search for <span className={`text-main_color_darker`}> "{localStorage.getItem('keyword')}"</span></h1>
                    {show_placeholders &&
                        <div className={`pb-4 container w-full justify-center items-center flex flex-wrap sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}>
                            {Array.from({length: 10}).map((_, index) => (
                                <BookPlaceholder key={index}/>
                            ))}
                        </div>
                    }
                    <div className={`${show_placeholders ? 'invisible' : 'visible flex'} pb-4 container w-full justify-center items-center flex-wrap sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}>
                        {show_results}
                    </div>
                </div>
                <aside className={`hidden font-roboto-semi-bold text-2xl text-text_color md:flex flex-col gap-y-8`}>
                    <CategorySidebar/>
                </aside>
            </div>
            <Footer styles={`bg-white`}/>
        </main>
    )
}
