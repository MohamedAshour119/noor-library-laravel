import {ChangeEvent, useEffect, useRef, useState} from 'react'
import {FaSearch} from "react-icons/fa";
import CoolLoading from "../CoolLoading.tsx";
import {SearchBooks} from "../../../Interfaces.ts";
import apiClient from "../../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import useDebounce from "../../hooks/UseDebounce.tsx";
import Result from "../Result.tsx";
import {useNavigate} from "react-router-dom";
import {setIsSearchModalOpenSlice} from "../../../redux/is_search_modal_open.ts";
// @ts-ignore
import {FormEventHandler} from "react/v18";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";

export default function ClientSearchInput() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const dispatch = useDispatch()
    const [isFocused, setIsFocused] = useState(false);
    const [is_results_open, setIs_results_open] = useState(false);
    const [search_value, setSearch_value] = useState('');
    const [results, setResults] = useState<SearchBooks[]>([]);
    const [is_loading, setIs_loading] = useState(false);

    const getSearchingResults = (keyword: string) => {
        setIs_loading(true)
        apiClient().get(`/books/search/${keyword}`)
            .then(res => {
                setResults(res.data.data.results)
                setIs_results_open(true)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => {
                setIs_loading(false)
            })
    }
    const handleSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch_value(e.target.value)
    }
    const debounce_value = useDebounce(search_value)

    useEffect(() => {
        if (debounce_value?.length > 0) {
            getSearchingResults(debounce_value);
        }
    }, [debounce_value]);

    const show_Results = results.map((result, index) => (
        <Result
            key={index}
            {...result}
            styles={index === 0 ? 'border-t-0' : ''}
        />
    ))
    const handleFocus = () => {
        setIsFocused(true)
    }
    const handleBlur = () => {
        setIsFocused(false)
    }

    const body_el = document.body;

    useEffect(() => {
        if (isFocused) {
            body_el.classList.add('search-input-active');
        } else {
            body_el.classList.remove('search-input-active');
        }
    }, [isFocused]);

    const resultRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!resultRef.current?.contains(e.target as Node)) {
                setIs_results_open(false)
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const navigate = useNavigate()
    const getKeywordSearchingResults = (e: FormEventHandler<HTMLFormElement>) => {
        e.preventDefault()
        const stored_results = localStorage.getItem('books_results')
        const stored_results_next_page_url = localStorage.getItem('books_results_next_page_url')

        if (stored_results || stored_results_next_page_url) {
            localStorage.removeItem('books_results')
            localStorage.removeItem('books_results_next_page_url')
            localStorage.removeItem('keyword')
        }
        localStorage.setItem('keyword', search_value)

        apiClient().get(`/books/search-keyword/${search_value}`)
            .then(res => {
                const results = res.data.data.results
                const results_next_page_url = res.data.data.next_page_url
                if (results.length > 0) {
                    localStorage.setItem('books_results', JSON.stringify(results))
                    localStorage.setItem('books_results_next_page_url', results_next_page_url)
                }

                navigate('/search-books-results')
                dispatch(setIsSearchModalOpenSlice(false))
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally()
    }

    return (
        <>
            {isFocused && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            <div ref={resultRef} className={``}>
                {/* Background when search input is active */}
                <div className={`relative`}>
                    <FaSearch className={`size-6 text-main_color absolute -translate-y-1/2 top-1/2 left-4 z-40`}/>
                    <input
                        type="text"
                        placeholder={translation.search_placeholder}
                        className={`sm:w-[40rem] w-full max-[468px]:placeholder:text-sm py-4 ps-12 pe-32 rounded-full focus:outline-0 text-text_color text-lg font-roboto-medium relative z-30`}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={search_value}
                        onChange={handleSearchValue}
                    />
                    <button className={`bg-main_color absolute right-[2px] top-[2px] py-4 px-8 rounded-full font-semibold z-30`}>{translation.search}</button>
                </div>
                {/* Results */}
                {search_value.length > 0 && is_results_open &&
                    <div className={`flex flex-col pb-3 pt-2 rounded-lg border-t bg-white z-30 absolute w-full text-text_color`}>
                        <h1 className={`font-roboto-semi-bold text-main_color_darker text-lg px-5 pb-3`}>Results</h1>
                        <button
                            onClick={getKeywordSearchingResults}
                            className={`border-y px-5 py-2 font-roboto-semi-bold ${results.length > 0 ? 'text-center' : 'text-left'}`}
                        >Search for: <span className={`text-main_color_darker`}> "{search_value}"</span>
                        </button>
                        <div className={`flex flex-col gap-y-3`}>
                            {!is_loading && show_Results}
                            {is_loading &&
                                <div className={`flex justify-center pb-20 pt-10`}>
                                    <CoolLoading/>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </>

    )
}
