import {enqueueSnackbar} from "notistack";
import GlobalInput from "../components/core/GlobalInput.tsx";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {
    AddBookInterface,
    AddBookDefaultValues,
    AddBookErrors,
    AddBookErrorsDefaultValues,
} from "../../Interfaces.ts";
import ReactSelect from "../components/ReactSelect.tsx";
import {SingleValue} from "react-select";
import {MdDone} from "react-icons/md";
import apiClient from "../../ApiClient.ts";
import {FaUpload} from "react-icons/fa";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

type BinaryOptions = {
    value: boolean
    label: string
    type: string
}
type OtherBookOptions = {
    value: string
    label: string
    type: string
}
export default function AddBook() {
    const translation = useSelector((state: RootState) => state.translationReducer)

    const [formData, setFormData] = useState<AddBookInterface>(AddBookDefaultValues)
    const [descriptionCount, setDescriptionCount] = useState(0)
    const [errors, setErrors] = useState<AddBookErrors | null>(AddBookErrorsDefaultValues)
    const [isLoading, setIsLoading] = useState(false)
    const [show_price_input, setShow_price_input] = useState(false)
    const [is_author_options, setIs_author_options] = useState<BinaryOptions[]>([])
    const [is_book_free_options, setIs_book_free_options] = useState<BinaryOptions[]>([])
    const [languages_options, setLanguages_options] = useState<OtherBookOptions[]>([])
    const [categories_options, setCategories_options] = useState<OtherBookOptions[]>([])

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;

        if (type === "checkbox") {
            // Convert the checkbox checked status to boolean explicitly
            const isChecked = (e.target as HTMLInputElement).checked;
            setFormData(prevState => ({
                ...prevState,
                [name]: isChecked,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
            }));
        }

        if (name === "book_description") {
            setDescriptionCount(value.length);
        }
    };

    const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const checkScrollbar = () => {
        if (textareaRef.current) {
            const { scrollHeight, clientHeight } = textareaRef.current;
            setIsScrollbarVisible(scrollHeight > clientHeight);
        }
    };

    useEffect(() => {
        checkScrollbar();
    }, [formData.book_description]);
    const handleBinaryOptionsSelectChange = (selectedOption: SingleValue<BinaryOptions | OtherBookOptions>) => {

        if (selectedOption && "value" in selectedOption) {
            if (selectedOption.type === 'is_author') {
                // @ts-ignore
                setFormData(prevState => ({
                    ...prevState,
                    is_author: selectedOption,
                }));
            } else if (selectedOption.type === 'is_book_free') {
                // @ts-ignore
                setFormData(prevState => ({
                    ...prevState,
                    is_free: selectedOption,
                }));
            }
        }
    };

    const handleOtherBookSelectChange = (selectedOption: SingleValue<OtherBookOptions | BinaryOptions>) => {
        if (selectedOption && "value" in selectedOption && typeof selectedOption.value === "string") {
            if (selectedOption?.type === 'category') {
                setFormData(prevState => ({
                    ...prevState,
                    category: selectedOption,
                }))
            } else if (selectedOption?.type === 'language') {
                setFormData(prevState => ({
                    ...prevState,
                    book_language: selectedOption,
                }))
            }
        }
    }

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        console.log('file run')

        if (files && files[0].type.startsWith('application') && files.length > 0) {

            setFormData(prevState => ({
                ...prevState,
                book_file: files[0],
            }));

        }
        // e.target.value = ''
    };

    const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0].type.startsWith('image') && files.length > 0) {
            setFormData(prevState => ({
                ...prevState,
                cover: files[0],
            }));
        }
        // e.target.value = ''
    };

    const cover_input = document.getElementById('cover-image') as HTMLInputElement;
    const book_input = document.getElementById('book-file') as HTMLInputElement;

    const handleForm = () => {
        const data = new FormData();
        data.append('title', formData.book_title);
        data.append('description', formData.book_description);
        // @ts-ignore
        data.append('is_author', String(formData.is_author?.value === 'yes' ? true :  formData.is_author?.value === 'no' ? false : null));
        // @ts-ignore
        data.append('is_free', String(formData.is_free?.value === 'yes' ? true :  formData.is_free?.value === 'no' ? false : null));
        data.append('price', String(formData.price));
        data.append('language', formData.book_language?.value || '');
        data.append('author', formData.author);
        data.append('category', formData.category?.value || '');
        data.append('downloadable', String(formData.downloadable));
        data.append('cover', formData.cover as Blob);
        data.append('book_file', formData.book_file as Blob);

        setIsLoading(true);
        apiClient().post('/add-book', data)
            .then((res) => {
                setIsLoading(false);
                enqueueSnackbar(res.data.message, { variant: "success", autoHideDuration: 10000 });
                setFormData(AddBookDefaultValues);
                setDescriptionCount(0);
                if (cover_input && book_input) {
                    cover_input.value = '';
                    book_input.value = '';
                }
                setErrors({});
            })
            .catch((err) => {
                setIsLoading(false);
                setErrors(err.response.data.errors);
                enqueueSnackbar(err.response.data.message, { variant: "error" });
            });
    };



    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleForm()
    }

    useEffect(() => {
        // @ts-ignore
        setShow_price_input(formData.is_free?.value === 'no');
    }, [formData.is_free]);

    useEffect(() => {
        apiClient().get(`/add-book-options`)
            .then(res => {
                const boolean_options = res.data.data.boolean_options;

                const is_author_options_modified = boolean_options.map((option: BinaryOptions) => ({
                    ...option,
                    type: 'is_author',
                }));
                setIs_author_options(is_author_options_modified);

                const is_book_free_options_modified = boolean_options.map((option: BinaryOptions) => ({
                    ...option,
                    type: 'is_book_free',
                }));
                setIs_book_free_options(is_book_free_options_modified);

                const languages = res.data.data.languages_options;
                setLanguages_options(languages);

                const categories = res.data.data.categories_options;
                setCategories_options(categories);
            })
            .catch(() => {
                enqueueSnackbar("Can't fetch the options", { variant: "error" });
            });
    }, []);



    return (
        <div className={`flex justify-center bg-main_bg py-5`}>
            <div className={`container w-full flex justify-center`}>
                <div className={`2xl:w-1/2 flex flex-col gap-y-10 bg-white p-8 rounded-lg border`}>
                    <h1 className={`font-roboto-bold text-2xl border-b-2 border-main_color w-fit pb-2`}>{translation.upload_book_page}</h1>

                    <form
                        onSubmit={handleSubmit}
                        className={`flex flex-col gap-y-6`}
                    >
                        <div>
                            <GlobalInput
                                label={translation.book_title}
                                id={`bookTitle`}
                                placeholder={translation.book_title_placeholder}
                                value={formData.book_title}
                                name={`book_title`}
                                onChange={handleFormChange}
                                error={errors?.title}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-gray-700 text-lg font-bold mb-2"
                                htmlFor="bookDescription"
                            >
                                {translation.book_description}<span className={`text-red-700`}>
                                <span className={`text-red-700 font-roboto-light`}>* </span>
                                ({translation.at_least_50_characters})
                                </span>
                            </label>
                            <div className={`relative`}>
                                <textarea
                                    className={`${errors?.description ? 'border-red-600 placeholder:text-red-600' : 'shadow'} appearance-none border rounded w-full min-h-[167px] pb-2 px-3 ${isScrollbarVisible ? 'pt-7' : 'pt-3'} text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    id="bookDescription"
                                    placeholder={translation.book_description_placeholder}
                                    value={formData.book_description}
                                    name={`book_description`}
                                    onChange={handleFormChange}
                                    maxLength={2000}
                                    ref={textareaRef}
                                />
                                {/*  Count  */}
                                <span className={`${descriptionCount >= 2000 ? 'text-red-700' : 'text-main_color'} z-10 absolute ltr:right-1 rtl:left-1 text-sm`}>
                                    {descriptionCount} / 2000
                                </span>
                                {isScrollbarVisible &&
                                    <span className={`h-5 bg-white w-[calc(100%-4px)] ltr:ml-[2px] rtl:mr-[2px] absolute top-[1px] ltr:left-0 rtl:right-0`}></span>
                                }
                                {errors?.description && <span className={`text-red-700`}>{errors?.description}</span>}
                            </div>
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                {translation.are_you_the_author}
                                <span className={`text-red-700 font-roboto-light`}>*</span>
                            </span>
                            <ReactSelect
                                value={
                                    formData.is_author
                                        ? {
                                            label: formData.is_author.label,
                                            value: formData.is_author.value,
                                            type: "is_author"
                                        }
                                        : null
                                }
                                placeholder={translation.select}
                                handleSelectChange={handleBinaryOptionsSelectChange}
                                options={is_author_options}
                                error={errors?.is_author}
                            />
                            {errors?.is_author && <span className={`text-red-700`}>{errors?.is_author}</span>}
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                {translation.language_of_the_book}
                                <span className={`text-red-700 font-roboto-light`}>*</span>
                            </span>
                            <ReactSelect
                                value={
                                    formData.book_language
                                        ? {
                                            label: formData.book_language.label,
                                            value: formData.book_language.value,
                                            type: "language"
                                        }
                                        : null
                                }
                                handleSelectChange={handleOtherBookSelectChange}
                                options={languages_options}
                                error={errors?.language}
                                placeholder={translation.language_of_the_book_placeholder}
                            />
                            {errors?.language && <span className={`text-red-700`}>{errors?.language}</span>}
                        </div>

                        <div>
                            <GlobalInput
                                label={translation.author_of_the_book}
                                id={`author`}
                                placeholder={translation.author_of_the_book_placeholder}
                                value={formData.author}
                                name={`author`}
                                onChange={handleFormChange}
                                additional_text={translation.full_name}
                                error={errors?.author}
                            />
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                {translation.category}
                                <span className={`text-red-700 font-roboto-light`}>*</span>
                            </span>
                            <ReactSelect
                                value={
                                    formData.category
                                        ? {
                                            label: formData.category.label,
                                            value: formData.category.value,
                                            type: "category"
                                        }
                                        : null
                                }
                                handleSelectChange={handleOtherBookSelectChange}
                                options={categories_options}
                                error={errors?.category}
                                placeholder={translation.category_placeholder}
                            />
                            {errors?.category && <span className={`text-red-700`}>{errors?.category}</span>}
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                {translation.is_the_book_free}
                                <span className={`text-red-700 font-roboto-light`}>*</span>
                            </span>
                            <ReactSelect
                                value={
                                    formData.is_free
                                        ? {
                                            label: formData.is_free.label,
                                            value: formData.is_free.value,
                                            type: "is_book_free"
                                        }
                                        : null
                                }
                                handleSelectChange={handleBinaryOptionsSelectChange}
                                options={is_book_free_options}
                                error={errors?.is_free}
                                placeholder={translation.select}
                            />
                            {errors?.is_free && <span className={`text-red-700`}>{errors?.is_free}</span>}
                        </div>

                        {show_price_input &&
                            <div>
                                <GlobalInput
                                    label={translation.price}
                                    id={`price`}
                                    type={`number`}
                                    placeholder={translation.enter_amount}
                                    value={formData.price}
                                    name={`price`}
                                    onChange={handleFormChange}
                                    additional_text={translation.price_in_usd}
                                    error={errors?.price}
                                />
                            </div>
                        }

                        <label
                            className={`${errors?.cover ? 'border-red-600 text-red-600' : 'shadow'} appearance-none leading-tight border bg-white px-2 py-[10px] rounded-md cursor-pointer flex items-center gap-x-2`}
                            htmlFor={`cover-image`}
                        >
                            <FaUpload className={`size-5 text-text_color`}/>
                            {!formData.cover
                                ? (
                                    <>
                                        {translation.upload_the_front_cover} <span className={`text-red-600`}>(jpeg, jpg, png, webp)</span>
                                    </>
                                )
                                : (
                                    formData.cover instanceof File ? formData.cover.name : ''
                                )
                            }
                            <input
                                type="file"
                                id={`cover-image`}
                                className="hidden"
                                onChange={handleCoverUpload}
                            />
                        </label>
                        {errors?.cover && <span className={`text-red-700 -mt-4`}>{errors?.cover}</span>}

                        <div className="flex items-start gap-x-2 mt-2">
                            <label htmlFor={`check`} className="flex cursor-pointer ">
                                <div className={`relative size-5`}>
                                    <input
                                        type="checkbox"
                                        className="peer size-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-main_color checked:border-main_color"
                                        id="check"
                                        onChange={handleFormChange}
                                        checked={formData.downloadable || false}
                                        name="downloadable"
                                    />
                                    <MdDone className={`absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none`}/>
                                </div>
                                <span className={`mx-2 -mt-1`}>{translation.the_book_is_for_review_only}</span>
                            </label>
                        </div>

                        <label
                            className={`${errors?.book_file ? 'border-red-600 text-red-600' : 'shadow'} appearance-none leading-tight border bg-white px-2 py-[10px] rounded-md cursor-pointer flex items-center gap-x-2`}
                            htmlFor={`book-file`}
                        >
                            <FaUpload className={`size-5 text-text_color`}/>
                            {!formData.book_file ? translation.upload_book : (formData.book_file instanceof File ? formData.book_file?.name : '')}
                            <input
                                type="file"
                                id={`book-file`}
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <span className={`text-red-700`}> {!formData.book_file ? `(${translation.pdf_only})` : ``}</span>
                        </label>
                        {errors?.book_file && <span className={`text-red-700 -mt-4`}>{errors?.book_file}</span>}

                        <button className={`flex justify-center text-xl gap-x-2 items-center rounded border border-main_color text-white px-3 py-2 bg-main_color hover:opacity-95 transition`}>
                            {!isLoading && translation.submit}
                            {isLoading &&
                                <div
                                    className='flex space-x-2 justify-center items-center py-2'>
                                    <span className='sr-only'>{translation.loading}</span>
                                    <div className='size-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='size-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div className='size-3 bg-white rounded-full animate-bounce'></div>
                                </div>
                            }
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
