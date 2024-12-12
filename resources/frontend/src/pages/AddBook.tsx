import {enqueueSnackbar, SnackbarProvider} from "notistack";
import GlobalTextInput from "../components/core/Global-Text-Input.tsx";
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {AddBookInterface, AddBookDefaultValues, AddBookErrors, AddBookErrorsDefaultValues} from "../../Interfaces.ts";
import ReactSelect from "../components/ReactSelect.tsx";
import {binary_options, book_categories, languages_options} from "../React-Select-Options.ts";
import {SingleValue} from "react-select";
import {MdDone} from "react-icons/md";
import {add_book_to_store_validation} from "../../zod-validation/add-book-to-store.ts";
import {z} from "zod";
import apiClient from "../../ApiClient.ts";
import {FaUpload} from "react-icons/fa";

type IsAuthorOption = {
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

    const [formData, setFormData] = useState<AddBookInterface>(AddBookDefaultValues);
    const [descriptionCount, setDescriptionCount] = useState(0);
    const [errors, setErrors] = useState<AddBookErrors | null>(AddBookErrorsDefaultValues);
    const [isLoading, setIsLoading] = useState(false);


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
                [name]: value,
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

    const handleIsAuthorSelectChange = (selectedOption: SingleValue<IsAuthorOption | OtherBookOptions>) => {
        if (selectedOption && "value" in selectedOption && typeof selectedOption.value === "boolean") {
            setFormData(prevState => ({
                ...prevState,
                is_author: selectedOption, // Update with boolean
            }));
        }
    };


    const handleOtherBookSelectChange = (selectedOption: SingleValue<OtherBookOptions | IsAuthorOption>) => {
        if (selectedOption && "value" in selectedOption && typeof selectedOption.value === "string") {
            if (selectedOption?.type === 'book_category') {
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


    const validateForm = (formData: AddBookInterface) => {
        try {
            const data = {
                book_title: formData.book_title, // Access directly from state
                book_description: formData.book_description,
                is_author: formData.is_author?.value, // This is already boolean
                book_language: formData.book_language?.value,
                author: formData.author,
                category: formData.category?.value,
                cover: formData.cover,
                downloadable: formData.downloadable,
                book_file: formData.book_file,
            };

            add_book_to_store_validation.parse(data);
            setErrors(null);
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce((acc, err) => {
                    (acc as Record<string, string>)[err.path[0]] = err.message;
                    return acc;
                }, {} as Record<string, string>);

                setErrors(formErrors);
            }
            return false;
        }
    };

    const cover_input = document.getElementById('cover-image') as HTMLInputElement;
    const book_input = document.getElementById('book-file') as HTMLInputElement;

    const handleForm = () => {
        if (!validateForm(formData)) {
            return
        }

        const data = new FormData();
        data.append('title', formData.book_title);
        data.append('description', formData.book_description);
        data.append('is_author', String(formData.is_author?.value));
        data.append('language', formData.book_language?.value || '');
        data.append('author', formData.author);
        data.append('category', formData.category?.value || '');
        data.append('downloadable', String(formData.downloadable));
        data.append('cover', formData.cover as Blob);
        data.append('book_file', formData.book_file as Blob);

        setIsLoading(true)
        apiClient().post('/add-book', data)
            .then((res) => {
                setIsLoading(false)
                enqueueSnackbar(res.data.message, { variant: "success", autoHideDuration: 10000 })
                setFormData(AddBookDefaultValues)
                setDescriptionCount(0)
                if (cover_input && book_input) {
                    cover_input.value = ''
                    book_input.value = ''
                }
            })
            .catch(() => {
                setIsLoading(false)
                enqueueSnackbar('Something wrong happened!', { variant: "error" })
            })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleForm()
    }

    return (
        <div className={`flex justify-center bg-main_bg py-5`}>
            <SnackbarProvider
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            />
            <div className={`container w-full flex justify-center`}>
                <div className={`2xl:w-1/2 flex flex-col gap-y-10 bg-white p-8 rounded-lg border`}>
                    <h1 className={`font-roboto-bold text-2xl border-b-2 border-main_color w-fit pb-2`}>Upload Book</h1>

                    <form
                        onSubmit={handleSubmit}
                        className={`flex flex-col gap-y-6`}
                    >
                        <div>
                            <GlobalTextInput
                                label={`Book Title`}
                                id={`bookTitle`}
                                placeholder={`Enter book title`}
                                value={formData.book_title}
                                name={`book_title`}
                                onChange={handleFormChange}
                                error={errors?.book_title}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-gray-700 text-lg font-bold mb-2"
                                htmlFor="bookDescription"
                            >
                                Book Description<span className={`text-red-700`}>
                                <span className={`text-red-700 font-roboto-light`}>* </span>
                                (At least 50 characters)
                                </span>
                            </label>
                            <div className={`relative`}>
                                <textarea
                                    className={`${errors?.book_description ? 'border-red-600 placeholder:text-red-600' : 'shadow'} appearance-none border rounded w-full min-h-[167px] pb-2 px-3 ${isScrollbarVisible ? 'pt-7' : 'pt-3'} text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    id="bookDescription"
                                    placeholder="Enter book description"
                                    value={formData.book_description}
                                    name={`book_description`}
                                    onChange={handleFormChange}
                                    maxLength={2000}
                                    ref={textareaRef}
                                />
                                {/*  Count  */}
                                <span className={`${descriptionCount >= 2000 ? 'text-red-700' : 'text-main_color'} z-10 absolute right-1 text-sm`}>
                                    {descriptionCount} / 2000
                                </span>
                                {isScrollbarVisible &&
                                    <span className={`h-5 bg-white w-[calc(100%-4px)] ml-[2px] absolute top-[1px] left-0`}></span>
                                }
                                {errors?.book_description && <span className={`text-red-700`}>{errors?.book_description}</span>}
                            </div>
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                Are you the author of the book?
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
                                handleSelectChange={handleIsAuthorSelectChange}
                                options={binary_options}
                                error={errors?.is_author}
                            />
                            {errors?.is_author && <span className={`text-red-700`}>{errors?.is_author}</span>}
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                Language of the book
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
                                }                                handleSelectChange={handleOtherBookSelectChange}
                                options={languages_options}
                                error={errors?.book_language}
                            />
                            {errors?.book_language && <span className={`text-red-700`}>{errors?.book_language}</span>}
                        </div>

                        <div>
                            <GlobalTextInput
                                label={`Author of the book`}
                                id={`author`}
                                placeholder={`Enter author name`}
                                value={formData.author}
                                name={`author`}
                                onChange={handleFormChange}
                                additional_text={`Full Name`}
                                error={errors?.author}
                            />
                        </div>

                        <div>
                            <span className={`block text-gray-700 text-lg font-bold mb-2`}>
                                Category
                                <span className={`text-red-700 font-roboto-light`}>*</span>
                            </span>
                            <ReactSelect
                                value={
                                    formData.category
                                        ? {
                                            label: formData.category.label,
                                            value: formData.category.value,
                                            type: "book_category"
                                        }
                                        : null
                                }
                                handleSelectChange={handleOtherBookSelectChange}
                                options={book_categories}
                                error={errors?.category}
                            />
                            {errors?.category && <span className={`text-red-700`}>{errors?.category}</span>}
                        </div>

                        <label
                            className={`${errors?.cover ? 'border-red-600 text-red-600' : 'shadow'} appearance-none leading-tight border bg-white px-2 py-[10px] rounded-md cursor-pointer flex items-center gap-x-2`}
                            htmlFor={`cover-image`}
                        >
                            <FaUpload className={`size-5 text-text_color`}/>
                            {!formData.cover ? `Upload the front cover` : (formData.cover instanceof File ? formData.cover?.name : '')}
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
                                <span className={`mx-2 -mt-1`}>The book is for review only and not for downloading, because copyright is reserved, Users will not be able to download the book.</span>
                            </label>
                        </div>

                        <label
                            className={`${errors?.book_file ? 'border-red-600 text-red-600' : 'shadow'} appearance-none leading-tight border bg-white px-2 py-[10px] rounded-md cursor-pointer flex items-center gap-x-2`}
                            htmlFor={`book-file`}
                        >
                            <FaUpload className={`size-5 text-text_color`}/>
                            {!formData.book_file ? `Upload Book` : (formData.book_file instanceof File ? formData.book_file?.name : '')}
                            <input
                                type="file"
                                id={`book-file`}
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <span className={`text-red-700`}> {!formData.book_file ? `(PDF only)` : ``}</span>
                        </label>
                        {errors?.book_file && <span className={`text-red-700 -mt-4`}>{errors?.book_file}</span>}

                        <button className={`flex justify-center text-xl gap-x-2 items-center rounded border border-main_color text-white px-3 py-2 bg-main_color hover:opacity-95 transition`}>
                            {!isLoading && 'Submit'}
                            {isLoading &&
                                <div
                                    className='flex space-x-2 justify-center items-center py-2'>
                                    <span className='sr-only'>Loading...</span>
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
