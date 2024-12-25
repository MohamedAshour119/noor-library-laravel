// Fetch the label for the book's language based on its value
import {languages_options} from "../React-Select-Options.ts";

export const get_book_language_label = (language_value: string) => {
    const language = languages_options.find(lang => lang.value === language_value);
    return language ? language.label : undefined;
};
