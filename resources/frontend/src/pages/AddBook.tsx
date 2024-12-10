import {SnackbarProvider} from "notistack";

export default function AddBook() {
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

                        <GlobalUploadInput
                            label={!formData.cover ? `Upload the front cover` : (formData.cover instanceof File ? formData.cover?.name : '')}
                            id={`cover-image`}
                            onFileChange={handleCoverUpload}
                            error={errors?.cover}
                        />

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

                        <GlobalUploadInput
                            label={!formData.book_file ? `Upload Book` : (formData.book_file instanceof File ? formData.book_file?.name : '')}
                            id={`book-file`}
                            additional_text={!formData.book_file ? `PDF only` : ``}
                            onFileChange={handleFileUpload}
                            error={errors?.book_file}
                        />

                        <button className={`flex justify-center text-xl gap-x-2 items-center rounded border border-main_color text-white px-3 py-2 bg-main_color hover:opacity-95 transition`}>
                            {!isLoading && <>Submit</>}
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
