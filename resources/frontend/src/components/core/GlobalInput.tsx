import {ChangeEvent} from 'react'

interface Props {
    label: string
    id: string
    type?: string
    label_styles?: string
    input_styles?: string
    placeholder: string
    value: string | number | null
    name: string
    is_required?: boolean
    additional_text?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    error?: string | null
}
export default function GlobalInput(props: Props) {
    const { label, id, type = 'text', label_styles, input_styles, placeholder, value, is_required = true, additional_text, name, onChange, error } = props
    return (
        <>
            <label
                className={`${label_styles} block text-gray-700 text-lg font-bold mb-2`}
                htmlFor={id}
            >
                {label}
                {is_required && <span className={`text-red-700 font-roboto-light`}>* </span>}
                {additional_text &&
                    <span className={`text-red-700`}>
                    ({additional_text})
                    </span>
                }
            </label>
            <input
                className={`${input_styles} ${error ? 'border-red-600 placeholder:text-red-600 mb-1' : 'shadow'} appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value ?? ''}
                name={name}
                onChange={onChange}
            />
            {error && <span className={`text-red-700`}>{error}</span>}
        </>
    )
}
