import { enqueueSnackbar } from "notistack";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../../ApiClient.ts";
import { SearchBooks } from "../../Interfaces.ts";
import { setIsSearchModalOpenSlice } from "../../redux/is_search_modal_open.ts";
import { RootState } from "../../redux/store.ts";
import useDebounce from "../hooks/UseDebounce.tsx";
import CoolLoading from "./CoolLoading.tsx";
import GlobalInput from "./core/GlobalInput.tsx";
import Result from "./Result.tsx";
// @ts-ignore
import { FormEventHandler } from "react/v18";
import { setIsSearchTriggered } from "../../redux/is_search_triggered.ts";
import Modal from "./Modal.tsx";

export default function SearchModal() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const dispatch = useDispatch()

    const [search_value, setSearch_value] = useState('');
    const [results, setResults] = useState<SearchBooks[]>([]);
    const [is_loading, setIs_loading] = useState(false);

    const getSearchingResults = (keyword: string) => {
        setIs_loading(true)
        apiClient().get(`/books/search/${keyword}`)
            .then(res => {
                setResults(res.data.data.results)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.errors)
            })
            .finally(() => setIs_loading(false))
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
    const handleClose = () => {
        dispatch(setIsSearchModalOpenSlice(false))
    }

    const modalRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modalRef.current?.contains(e.target as Node)) {
                dispatch(setIsSearchModalOpenSlice(false))
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const show_Results = results.map((result, index) => (
        <Result
            key={index}
            {...result}
        />
    ))
    const navigate = useNavigate()
    const getKeywordSearchingResults = (e: FormEventHandler<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(setIsSearchTriggered(true))
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

        <Modal
            isOpen={isSearchModalOpenSlice}
            onClose={handleClose}
            header={translation.search}
            ref={modalRef}
            parent_styles={`px-0 ${search_value.length > 0 ? 'pb-0' : 'pb-4'}`}
        >
            <main className={`pt-4 text-gray-500 dark:text-dark_text_color/70`}>
                 <form
                     className="space-y-6 px-4"
                     onSubmit={getKeywordSearchingResults}
                 >
                     <GlobalInput
                         label={translation.search}
                         id={`search_id`}
                         placeholder={translation.search_placeholder}
                         value={search_value}
                         name={`search`}
                         onChange={handleSearchValue}
                         input_styles={`py-3 !mt-0`}
                         is_required={false}
                     />
                 </form>

                 {/* Results */}
                 {search_value.length > 0 &&
                     <div className={`flex flex-col py-3 border-t dark:border-dark_border_color mt-3`}>
                         <span className={`font-roboto-semi-bold text-main_color_darker dark:text-dark_text_color/70 text-lg px-5 pb-3`}>{translation.results}</span>
                         <button
                             onClick={getKeywordSearchingResults}
                             className={`border-t dark:border-dark_border_color px-5 py-2 font-roboto-semi-bold ${results.length > 0 ? 'text-center' : 'ltr:text-left rtl:text-right'}`}
                         >{translation.search_for}: <span className={`text-main_color_darker dark:text-dark_text_color`}> "{search_value}"</span>
                         </button>
                         <div className={`flex flex-col gap-y-3 dark:text-dark_text_color`}>
                             {!is_loading && show_Results}
                             {is_loading &&
                                 <div className={`flex justify-center pb-20 pt-10`}>
                                     <CoolLoading/>
                                 </div>
                             }
                         </div>
                     </div>
                 }
            </main>

        </Modal>
    )
}
