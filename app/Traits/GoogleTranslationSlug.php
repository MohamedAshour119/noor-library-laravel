<?php
namespace App\Traits;

use Stichoza\GoogleTranslate\GoogleTranslate;

trait GoogleTranslationSlug
{
    function translateTextDynamically($text, $sourceLanguage, $targetLanguage, $id)
    {
        try {
            // Create a new GoogleTranslate instance for the target language
            $translator = new GoogleTranslate($targetLanguage);
            $translator->setSource($sourceLanguage); // Set the source language
            $translatedText = $translator->translate($text);

            // Split the translated text into words and add hyphen after each word
            $words = explode(' ', $translatedText);  // Split the sentence into words
            $translatedTextWithHyphens = implode('-', $words); // Join words with hyphens

            // Append the book ID to the translated text
            $translatedTextWithHyphens .= '-' . $id;

            return $translatedTextWithHyphens; // Return the hyphenated translated text with ID
        } catch (\Exception $e) {
            // Handle translation errors (fallback to the original text if an error occurs)
            return $text;
        }
    }
}

