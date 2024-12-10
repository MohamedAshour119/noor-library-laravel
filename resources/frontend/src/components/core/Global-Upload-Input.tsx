import {ChangeEvent} from 'react'
import {FaUpload} from "react-icons/fa";

interface Props {
    label: string
    id: string
    additional_text?: string
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string | null
}
export default function GlobalUploadInput({label, id, additional_text, onFileChange, error}: Props) {

    return (
        <>
            <label
                className={`${error ? 'border-red-600 text-red-600' : 'shadow'} appearance-none leading-tight border bg-white px-2 py-[10px] rounded-md cursor-pointer flex items-center gap-x-2`}
                htmlFor={id}
            >
                <FaUpload className={`size-5 text-text_color`}/>
                {label}
                {additional_text && <span className={`text-red-700`}> ({additional_text})</span>}
            </label>
            <input
                type="file"
                id={id}
                className="hidden"
                onChange={onFileChange}
            />
            {error && <span className={`text-red-700 -mt-4`}>{error}</span>}
        </>
    )
}
