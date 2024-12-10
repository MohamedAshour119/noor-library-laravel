import React from 'react'
import Select, {GroupBase, SingleValue, StylesConfig} from "react-select";
import '../app/globals.css';

interface Props {
    options: IsAuthorOption[] | OtherBookOptions[];
    handleSelectChange: (selectedOption: SingleValue<IsAuthorOption | OtherBookOptions>) => void;
    error?: string | boolean | null;
    value?: IsAuthorOption | OtherBookOptions | null;
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

export default function ReactSelect({options, handleSelectChange, error, value}: Props) {

    const customStyles: StylesConfig<IsAuthorOption | OtherBookOptions, false, GroupBase<IsAuthorOption | OtherBookOptions>> = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'ease-in-out',
            boxShadow: !error ? '0px 0px 6px 1px rgba(0,0,0,0.10)' : '',
            border: error ? '1px solid #DC2626' : '0px solid transparent',
            appearance: 'none',
            lineHeight: 1.25,
            marginBottom: '4px',
            outline: 'none',
            padding: '3px 3px 0px 3px',
            '&:hover': {
                borderColor: isDisabled ? 'transparent' : 'none',
            },
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
            boxShadow: '0px 0px 6px 1px rgba(0,0,0,0.10)'
        }),

        option: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: 'transparent',
            color: "#444444",
            ":hover": {
                backgroundColor: '#45B09E',
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
        })
    }

    return (
        <Select
            isClearable={false}
            options={options}
            styles={customStyles}
            onChange={handleSelectChange}
            value={value}
        />
    )
}
