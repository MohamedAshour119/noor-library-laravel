import {ChangeEvent, useState} from 'react';

interface Props {
    placeholder: string;
    id: string;
    name: string;
    type?: string;
    styles?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    error: string | undefined
}

export default function TextInputAuth({ placeholder, id, name, value, type = 'text', styles, onChange, error }: Props) {
    const [hasContent, setHasContent] = useState(!!value);
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    const toggleShowPassword = () => {
        setIsPasswordShow(!isPasswordShow);
    };

    return (
        <div className={`flex flex-col gap-y-0`}>
            <div className="relative sm:w-[22rem]">
                <input
                    name={name}
                    type={type === 'password' && !isPasswordShow ? 'password' : 'text'}
                    id={id}
                    value={value}
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e);
                        }
                        setHasContent(!!e.target.value);
                    }}
                    className={`${styles} bg-input_bg py-2 ${type === 'password' ? 'pe-12' : ''} px-4 w-full text-xl border ${!error ? 'border-border_color' : 'border-red-600'} rounded focus:outline-0 focus:ring-2 ${!error ? 'focus:ring-main_color' : 'focus:ring-red-600'} duration-200 transition-all`}
                    onFocus={() => setHasContent(true)}
                    onBlur={(e) => setHasContent(!!e.target.value)}
                />

                <label
                    htmlFor={id}
                    className={`absolute left-4 px-1 text-xl ${!error ? 'text-black/40' : 'text-red-600'} bg-input_bg border border-transparent rounded-full hover:cursor-text transition-all duration-200 ${hasContent ? '!text-sm -top-3 !text-black' : 'top-2 bg-transparent'}`}
                >
                    {placeholder}
                </label>

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="text-main_color absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        {isPasswordShow ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
            <span className={`text-red-600`}>{error}</span>
        </div>
    );
}
