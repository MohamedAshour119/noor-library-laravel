import {Modal} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setIsSearchModalOpenSlice} from "../../redux/is_search_modal_open.ts";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import GlobalInput from "./core/GlobalInput.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import apiClient from "../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import {SearchBooks} from "../../Interfaces.ts";
import Result from "./Result.tsx";
import CoolLoading from "./CoolLoading.tsx";

export default function SearchModal() {
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
    return (
        <Modal
            show={isSearchModalOpenSlice}
            onClose={handleClose}
            className={`relative w-[23rem] xxs:w-[30rem] sm:w-[40rem] !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 animate-fade-in`}
            ref={modalRef}
        >
            <Modal.Header className={`!border-b modal-header !py-3`}>
                <h3 className="text-xl text-main_color_darker font-medium">Search</h3>
            </Modal.Header>
            <Modal.Body className={`py-3 px-5`}>
                <form className="space-y-6">
                    <GlobalInput
                        label={`Search`}
                        id={`search_id`}
                        placeholder={`Search for books`}
                        value={search_value}
                        name={`search`}
                        onChange={handleSearchValue}
                        input_styles={`py-3 !mt-0`}
                        is_required={false}
                    />
                </form>
            </Modal.Body>
            {/* Results */}
            {search_value.length > 0 &&
                <div className={`flex flex-col py-3 border-t`}>
                    <h1 className={`font-roboto-semi-bold text-main_color_darker text-lg px-5 pb-3`}>Results</h1>
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
        </Modal>
    )
}
