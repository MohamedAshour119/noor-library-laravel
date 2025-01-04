<?php
namespace App\Traits;

use Stichoza\GoogleTranslate\GoogleTranslate;

trait GoogleTranslation
{
    function translateTextDynamically($text, $targetLanguage)
    {
        try {
            if ($text) {
                // Create a new GoogleTranslate instance for the target language
                $translator = new GoogleTranslate($targetLanguage);
                return $translator->translate($text);
            }

        } catch (\Exception $e) {
            // Handle translation errors (fallback to the original text if an error occurs)
            return $text;
        }
    }
}
