import Select, {GroupBase, SingleValue, StylesConfig} from "react-select";
import '../App.css';
import {useDarkMode} from "../hooks/UseDarkMode.ts";

interface Props {
    options: IsAuthorOption[] | OtherBookOptions[];
    handleSelectChange: (selectedOption: SingleValue<IsAuthorOption | OtherBookOptions>) => void;
    error?: string | boolean | null;
    value?: IsAuthorOption | OtherBookOptions | null;
    placeholder?: string
}

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

export default function ReactSelect({options, handleSelectChange, error, value, placeholder}: Props) {

    const is_dark_mode = useDarkMode()

    const customStyles: StylesConfig<IsAuthorOption | OtherBookOptions, false, GroupBase<IsAuthorOption | OtherBookOptions>> = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: is_dark_mode ? 'var(--dark_main_color)' : 'white',
            cursor: 'pointer',
            transition: 'ease-in-out',
            boxShadow: !error ? '0px 0px 6px 1px rgba(0,0,0,0.10)' : '',
            border: error && !is_dark_mode ? '1px solid #DC2626' : !error && is_dark_mode ? '1px solid var(--dark_border_color)' : '0px solid transparent',
            appearance: 'none',
            lineHeight: 1.25,
            marginBottom: '4px',
            outline: 'none',
            padding: '3px 3px 0px 3px',
            '&:hover': {
                borderColor: isDisabled ? 'transparent' : 'none',
            },
        }),
        input: (defaultStyles) => ({
            ...defaultStyles,
            color: is_dark_mode ? 'var(--dark_text_color)' : 'white',
        }),

        indicatorSeparator: (defaultStyles) => ({
            ...defaultStyles,
            display: "none",
        }),

        dropdownIndicator: (defaultStyles) => ({
            ...defaultStyles,
            color: '#9CA3AF',
            ":hover": {
                color: '#9CA3AF'
            }
        }),

        menu: (defaultStyles) => ({
            ...defaultStyles,
            boxShadow: '0px 0px 6px 1px rgba(0,0,0,0.10)',
            backgroundColor: is_dark_mode ? 'var(--dark_main_color)' : '',
        }),

        option: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: 'transparent',
            color: is_dark_mode ? 'var(--dark_text_color)' : '#444444',
            ":hover": {
                backgroundColor: is_dark_mode ? 'var(--dark_border_color)' : 'var(--main_color)',
                color: 'white',
            },
            cursor: 'pointer',
            borderRadius: '3px'
        }),

        menuList: (base) => ({
            ...base,
            "::-webkit-scrollbar": {
                width: "4px",
                height: "0px",
            },
        }),

        placeholder: (defaultStyles) => ({
            ...defaultStyles,
            color: error ? '#DC2626' : '#9CA3AF'
        }),
        singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: is_dark_mode ? 'var(--dark_text_color)' : ''
        })
    }

    return (
        <Select
            isClearable={false}
            options={options}
            styles={customStyles}
            onChange={handleSelectChange}
            value={value}
            placeholder={placeholder}
        />
    )
}
