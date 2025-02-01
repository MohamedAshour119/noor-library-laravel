<?php
namespace App\Traits;

use Stichoza\GoogleTranslate\GoogleTranslate;

trait GoogleTranslation
{
    function translateTextDynamically($content, $targetLanguage)
    {
        try {
            if ($content) {
                // Create a new GoogleTranslate instance for the target language
                $translator = new GoogleTranslate($targetLanguage);
                return $translator->translate($content);
            }

        } catch (\Exception $e) {
            return $content;
        }
    }
}
