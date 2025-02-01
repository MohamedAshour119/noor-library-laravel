<?php

namespace App\Traits;
use Symfony\Component\Intl\Languages;
trait GetLanguageCodeFromName {
    function getLanguageCodeFromName(string $languageName, string $displayLocale = 'en'): ?string
    {
        // Retrieve an array of language codes and their names for the specified display locale.
        $languages = Languages::getNames($displayLocale);

        // Loop through the array and compare language names in a case-insensitive way.
        foreach ($languages as $code => $name) {
            if (strcasecmp($name, $languageName) === 0) {
                return $code;
            }
        }
        return null;
    }
}
