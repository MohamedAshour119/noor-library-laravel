<?php
namespace App\Traits;

use Stichoza\GoogleTranslate\GoogleTranslate;

trait GoogleTranslation
{
    function translateTextDynamically($text, $sourceLanguage, $targetLanguage)
    {
        try {
            // Create a new GoogleTranslate instance for the target language
            $translator = new GoogleTranslate($targetLanguage);
            $translator->setSource($sourceLanguage); // Set the source language
            return $translator->translate($text);
        } catch (\Exception $e) {
            // Handle translation errors (fallback to the original text if an error occurs)
            return $text;
        }
    }
}
