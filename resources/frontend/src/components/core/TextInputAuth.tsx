import {ChangeEvent, useState} from 'react';

interface Props {
    placeholder: string;
    id: string;
    name: string;
    type?: string;
    styles?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string | undefined
    is_sign_in_failed?: boolean
    readonly?:boolean
    disable_label_animation?: boolean
}

export default function TextInputAuth(props: Props) {
    const { placeholder, id, name, value, type = 'text', styles, onChange, error, is_sign_in_failed = false, readonly = false, disable_label_animation = false } = props
    const [hasContent, setHasContent] = useState(!!value);
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    const toggleShowPassword = () => {
        setIsPasswordShow(!isPasswordShow);
    };

    return (
        <div className={`flex flex-col gap-y-0`}>
            <div className="relative sm:w-full">
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
                    className={`bg-input_bg py-2 ${type === 'password' ? 'pe-12' : ''} px-4 w-full text-xl ${styles} border ${!error && !is_sign_in_failed ? 'border-border_color' : 'border-red-600'} rounded focus:outline-0 focus:ring-2 ${!error && !is_sign_in_failed ? 'focus:ring-main_color' : 'focus:ring-red-600'} duration-200 transition-all`}
                    onFocus={() => setHasContent(true)}
                    onBlur={(e) => setHasContent(!!e.target.value)}
                    readOnly={readonly}
                />

                <label
                    htmlFor={id}
                    className={`absolute left-4 px-1 ${!error ? 'text-black/40' : 'text-red-600'} bg-input_bg border border-transparent rounded-full hover:cursor-text transition-all duration-200 ${hasContent || !disable_label_animation ? '!text-sm -top-3 !text-black' : 'top-2 bg-transparent'}`}
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
