
export default function ReviewPlaceholder() {
    return (
        <div className={`flex gap-x-3`}>
            <div className={`flex items-center justify-center animate-pulse size-12 min-h-12 min-w-12 bg-gray-300 dark:bg-dark_border_color rounded-full`}>
                <svg
                    className={`size-5 text-gray-400`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
            </div>

            <div
                role="status"
                className={`rounded-lg bg-white dark:bg-dark_second_color w-full p-5 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center`}
            >
                <div className={`w-full`}>
                    <div
                        className={`h-2.5 bg-gray-300 dark:bg-dark_icon_color rounded-full w-48 mb-5`}
                    ></div>
                    <div
                        className={`h-2 bg-gray-300 dark:bg-dark_icon_color rounded-full max-w-[480px] mb-4`}
                    ></div>
                    <div
                        className={`h-2 bg-gray-300 dark:bg-dark_icon_color rounded-full mb-2.5`}
                    ></div>
                    <div
                        className={`h-2 bg-gray-300 dark:bg-dark_icon_color rounded-full max-w-[440px] mb-2`}
                    ></div>
                    <div
                        className={`h-2 bg-gray-300 dark:bg-dark_icon_color rounded-full max-w-[460px] mb-2`}
                    ></div>
                    <div
                        className={`h-2 bg-gray-300 dark:bg-dark_icon_color rounded-full max-w-[360px]`}
                    ></div>
                </div>
                <span className={`sr-only`}>Loading...</span>
            </div>
        </div>
    )
}
